import { Request, Response, NextFunction } from "express";
import {
  checkSchema,
  validationResult,
  ValidationChain,
  ParamSchema,
} from "express-validator";
import createHttpError from "http-errors";

interface AccommodationSchema {
  [key: string]: ParamSchema;
  name: ParamSchema;
  description: ParamSchema;
  maxGuests: ParamSchema;
  // host: ParamSchema;
}

const accommodationSchema: AccommodationSchema = {
  name: {
    in: "body",
    isString: {
      errorMessage: "Name is a mandatory field and needs to be a String.",
    },
  },
  description: {
    in: "body",
    isString: {
      errorMessage:
        "Description is a mandatory field and needs to be a String.",
    },
  },
  maxGuests: {
    in: "body",
    isInt: {
      errorMessage:
        "Maximum amount of allowed guests is a mandatory field and needs to be a Number.",
    },
  },
};

export const checksAccommodationSchema: ValidationChain[] =
  checkSchema(accommodationSchema);

export const triggerBadRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  console.log(errors.array());

  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Error during accommodation post validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next(); // no errors
  }
};

// VALIDATION CHAIN 1. checksAccommodationSchema --> 2. triggerBadRequest
