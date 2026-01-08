import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signToken(payload: { userId: number; email: string }) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "1d" });
}
