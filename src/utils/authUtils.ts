import jwt from "jsonwebtoken";

export const signJwt = (email: string) => {
  const jwtsecret = process.env.JWT_SECRET;

  if (!jwtsecret) {
    throw new Error("JWT_SECRET not found in environment variables");
  }

  return jwt.sign({ email }, jwtsecret, {
    expiresIn: "1h",
  });
};
