import express from "express";
import createHttpError from "http-errors";
import { createAccessToken } from "../../lib/auth/tools.js";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";
import UsersModel from "./model.js";
import AccommodationsModel from "../accommodations/model.js";
import { checksUserSchema } from "./validator.js";
import { hostOnlyMiddleware } from "../../lib/auth/hostsOnly.js";
import mongoose from "mongoose";
const usersRouter = express.Router();

usersRouter.post("/register", checksUserSchema, async (req, res, next) => {
  try {
    req.body.avatar = `https://ui-avatars.com/api/?name=${req.body.firstName} ${req.body.lastName}`;

    const user = {
      ...req.body,
    };

    const newUser = new UsersModel(user); // here it happens validation (thanks to Mongoose) of req.body, if it is not ok Mongoose will throw an error
    const { _id } = await newUser.save();

    // Obtaining the credentials from req.body
    const { email, password } = req.body;

    const payload = { _id: user._id, role: user.role };

    const accessToken = await createAccessToken(payload);

    res.status(201).send({ accessToken });
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    // 1. Obtain the credentials from req.body
    const { email, password } = req.body;

    // 2. Verify the credentials
    const user = await UsersModel.checkCredentials(email, password);

    if (user) {
      // 3.1 If credentials are fine --> generate an access token (JWT) and send it back as a response
      const payload = { _id: user._id, role: user.role };

      const accessToken = await createAccessToken(payload);
      res.send({ accessToken });
    } else {
      // 3.2 If credentials are NOT fine --> trigger a 401 error
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    console.log(
      "🚀 ~ file: index.js:61 ~ usersRouter.get ~ req.user",
      req.user
    );
    const user = await UsersModel.findById(req.user._id);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.get(
  "/me/accommodations",
  //   JWTAuthMiddleware,
  //   hostOnlyMiddleware,
  async (req, res, next) => {
    try {
      //   console.log("🚀 ~ file: index.js:81 ~ req.user._id", req.user._id);
      const accommodations = await AccommodationsModel.find();

      res.send(accommodations);
    } catch (error) {
      next(error);
    }
  }
);

export default usersRouter;
