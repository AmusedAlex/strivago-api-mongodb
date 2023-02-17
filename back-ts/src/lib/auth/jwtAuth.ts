import createHttpError from "http-errors";
import { verifyAccessToken } from "./tools";
import { Request, Response, NextFunction } from "express";

interface RequestWithUser extends Request {
  user?: { _id: string; role: string };
}

export const JWTAuthMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  // 1. Check if authorization header is in the request, if it is not --> 401
  if (!req.headers.authorization) {
    next(
      createHttpError(
        401,
        "Please provide Bearer Token in the authorization header!"
      )
    );
  } else {
    try {
      // 2. If authorization header is there, we should extract the token from it
      // ("Bearer eyJhbGciOiJIUzI1NiIs...")
      const accessToken = req.headers.authorization.replace("Bearer ", "");

      // 3. Verify token (check the integrity and check expiration date)
      const payload = await verifyAccessToken(accessToken);

      // 4. If everything is fine we should get back the payload and no errors --> next
      req.user = {
        _id: payload.payload._id,
        role: payload.payload.role,
      };
      next();
    } catch (error) {
      console.log(error);
      // 5. If token is NOT ok, or in any case jsonwebtoken will throw some error --> 401
      next(createHttpError(401, "Token not valid!"));
    }
  }
};
