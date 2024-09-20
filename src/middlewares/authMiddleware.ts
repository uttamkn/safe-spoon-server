import { NextFunction, Response, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied, token missing!" });
  }

  const jwtsecret = process.env.JWT_SECRET;

  if (!jwtsecret) {
    console.error("JWT_SECRET not found in environment variables");
    return res
      .status(500)
      .json({ error: "Internal server error (env variables)" });
  }

  try {
    const decodedToken = jwt.verify(token, jwtsecret) as JwtPayload;
    req.user = decodedToken.email;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
