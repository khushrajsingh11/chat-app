import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  if (!process.env.JWT_TOKEN_SECRET) {
    throw new Error("JST_TOKEN_SECRET is not defined in environment variables.");
  }

  return jwt.sign({ userId }, process.env.JWT_TOKEN_SECRET, {
    expiresIn: "7d", 
  });
};