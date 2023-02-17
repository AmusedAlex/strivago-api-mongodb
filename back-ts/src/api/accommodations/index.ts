import express, { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth";
import AccommodationsModel from "./model";
import UsersModel from "../users/model.js";
import { hostOnlyMiddleware } from "../../lib/auth/hostsOnly";
import { checksAccommodationSchema } from "./validator";

const accommodationsRouter = express.Router();

accommodationsRouter.post(
  "/",
  checksAccommodationSchema,
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user === undefined) {
        throw new Error("User is undefined");
      }

      req.body.host = req.user._id;

      const accommodation = {
        ...req.body,
      };
      const newAccommodation = new AccommodationsModel(accommodation);
      // here it happens validation (thanks to Mongoose) of req.body, if it is not ok Mongoose will throw an error
      // if it is ok the accommodation is not saved yet
      const { _id } = await newAccommodation.save();
      res.status(201).send({ _id });
    } catch (error) {
      next(error);
    }
  }
);

accommodationsRouter.get(
  "/",
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accommodations = await AccommodationsModel.find().populate("host");
      res.send(accommodations);
    } catch (error) {
      next(error);
    }
  }
);

accommodationsRouter.get(
  "/:accommodationId",
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accommodation = await AccommodationsModel.findById(
        req.params.accommodationId
      ).populate("host");

      if (accommodation) {
        res.send(accommodation);
      } else {
        next(
          createHttpError(
            404,
            `Accommodation with id ${req.params.accommodationId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

accommodationsRouter.put(
  "/:accommodationId",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.accommodationId;

      const accommodation = await AccommodationsModel.findById(id);
      const host = accommodation?.host?.toString();
      const userId = req.user?._id;

      if (accommodation) {
        if (userId === host) {
          const updatedAccommodation =
            await AccommodationsModel.findByIdAndUpdate(id, req.body, {
              new: true,
            });
          res.status(200).send(updatedAccommodation);
        } else {
          res.status(403).send({
            message:
              "You are not allowed to make changes on this accommodation",
          });
        }
      } else {
        res.status(404).send({ message: "Accommodation not found!" });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default accommodationsRouter;
