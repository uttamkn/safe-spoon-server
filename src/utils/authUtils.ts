import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../env";

export const signJwt = (email: string) => {
  return jwt.sign({ email }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

export const verifyJwt = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
