import jwt from "jsonwebtoken";
import { Response } from "express";

export const signJwt = (email: string) => {
  const jwtsecret = process.env.JWT_SECRET;

  if (!jwtsecret) {
    throw new Error("JWT_SECRET not found in environment variables");
  }

  return jwt.sign({ email }, jwtsecret, {
    expiresIn: "1h",
  });
};

export const generateTokenAndSetCookie = (
  res: Response,
  email: string,
): void => {
  const token = signJwt(email);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
