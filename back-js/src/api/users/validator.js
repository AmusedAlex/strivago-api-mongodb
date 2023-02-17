import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const userSchema = {
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

export const checksUserSchema = checkSchema(userSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.array());

  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Error during user post validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next(); // no errors
  }
};

// VALIDATION CHAIN 1. checksUserSchema --> 2. triggerBadRequest
