import express from "express";
import createHttpError from "http-errors";
import { checksUserSchema } from "./validator";
import UsersModel from "./model";
import { createAccessToken } from "../../lib/auth/tools";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth";

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  checksUserSchema,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
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
  }
);

usersRouter.post(
  "/login",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
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
  }
);

usersRouter.get(
  "/me",
  JWTAuthMiddleware,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      console.log(
        "🚀 ~ file: index.ts:14 ~ usersRouter.get ~ req.user",
        req.user
      );
      const user = await UsersModel.findById(req.user?._id);
      res.send(user);
    } catch (error) {
      next(error);
    }
  }
);

export default usersRouter;
