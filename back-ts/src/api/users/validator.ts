import {
  checkSchema,
  validationResult,
  Schema,
  ValidationChain,
} from "express-validator";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const userSchema: Schema = {
  firstName: {
    in: ["body"],
    isString: {
      errorMessage: "Firstname is a mandatory field and needs to be a String.",
    },
  },
  lastName: {
    in: ["body"],
    isString: {
      errorMessage: "Lastname is a mandatory field and needs to be a String.",
    },
  },
  Email: {
    in: ["body"],
    isString: {
      errorMessage: "Email is a mandatory field and needs to be a String.",
    },
  },
  Password: {
    in: ["body"],
    isString: {
      errorMessage: "Password is a mandatory field and needs to be a String.",
    },
  },
  Role: {
    in: ["body"],
    isString: {
      errorMessage: "Role is a mandatory field and needs to be a String.",
    },
  },
};

export const checksUserSchema: ValidationChain[] = checkSchema(userSchema);

export const triggerBadRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Error during user post validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next();
  }
};
