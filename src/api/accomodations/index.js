import express from "express";
import createHttpError from "http-errors";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";
import AccomodationsModel from "./model.js";
import UsersModel from "../users/model.js";
import { hostOnlyMiddleware } from "../../lib/auth/hostsOnly.js";

const accomodationsRouter = express.Router();

accomodationsRouter.post(
  "/",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req, res, next) => {
    try {
      // if (req.user.role === "Guest") {
      //   const updatedUser = await UsersModel.findByIdAndUpdate(
      //     req.user._id,
      //     { role: "Host" },
      //     { new: true, runValidators: true }
      //   );
      // }

      const newAccomodation = new AccomodationsModel(req.body);
      // here it happens validation (thanks to Mongoose) of req.body, if it is not ok Mongoose will throw an error
      // if it is ok the accomodation is not saved yet
      const { _id } = await newAccomodation.save();
      res.status(201).send({ _id });
    } catch (error) {
      next(error);
    }
  }
);

accomodationsRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const accomodations = await AccomodationsModel.find().populate("host");
    res.send(accomodations);
  } catch (error) {
    next(error);
  }
});

accomodationsRouter.get(
  "/:accomodationId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const accomodation = await AccomodationsModel.findById(
        req.params.accomodationId
      ).populate("host"); // .populate({path:"host"}) 2nd version

      if (accomodation) {
        res.send(accomodation);
      } else {
        next(
          createHttpError(
            404,
            `Accomodation with id ${req.params.accomodationId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default accomodationsRouter;
