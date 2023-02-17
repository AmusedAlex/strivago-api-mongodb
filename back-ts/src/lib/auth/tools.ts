import jwt, { JwtPayload } from "jsonwebtoken";

export const createAccessToken = (
  payload: Record<string, any>
): Promise<string> =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
      (err: Error | null, token: string | undefined) => {
        if (err) reject(err);
        else resolve(token!);
      }
    )
  );

export const verifyAccessToken = (token: string): Promise<JwtPayload> =>
  new Promise((resolve, reject) =>
    jwt.verify(
      token,
      process.env.JWT_SECRET!,
      { complete: true, algorithms: ["HS256"] },
      (err: Error | null, originalPayload: JwtPayload | undefined) => {
        if (err) reject(err);
        else resolve(originalPayload!);
      }
    )
  );
