import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const accommodationSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Name is a mandatory field and needs to be a String.",
    },
  },
  description: {
    in: ["body"],
    isString: {
      errorMessage:
        "Description is a mandatory field and needs to be a String.",
    },
  },
  maxGuests: {
    in: ["body"],
    isInteger: {
      errorMessage:
        "Maximum amout of allowed guests is a mandatory field and needs to be a Number.",
    },
  },
  //   host: {
  //     in: ["body"],
  //     isString: {
  //       errorMessage: "Host is a mandatory field and needs to be a String (ID).",
  //     },
  //   },
};

export const checksAccommodationSchema = checkSchema(accommodationSchema);

export const triggerBadRequest = (req, res, next) => {
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
