import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface AuthRequest extends Request {
  user?: { userId: number; email: string };
}

export function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: number; email: string };
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
