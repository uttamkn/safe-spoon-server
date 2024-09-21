import { NextFunction, Response, Request } from "express";
import { verifyJwt } from "../utils/authUtils";
import { sendErrorResponse } from "../utils/errorUtils";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return sendErrorResponse(res, 401, "Token is required");
  }

  try {
    const decodedToken = verifyJwt(token);
    req.user = decodedToken.email;
    next();
  } catch (error) {
    return sendErrorResponse(res, 401, "Invalid token");
  }
};
