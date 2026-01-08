import type { Request, Response } from "express";
import { loginUser, registerUser } from "../services/authService.js";

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  try {
    const result = await registerUser(name, email, password);
    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ message: (err as Error).message });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const result = await loginUser(email, password);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ message: (err as Error).message });
  }
}
