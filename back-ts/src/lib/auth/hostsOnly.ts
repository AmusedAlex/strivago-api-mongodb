import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

interface User {
  _id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const hostOnlyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role === "Host") {
    next();
  } else {
    next(createHttpError(403, "Only Hosts can offer accomodations!"));
  }
};
