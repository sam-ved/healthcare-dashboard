import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { signToken } from "../utils/jwt.js";

export interface AuthResult {
  token: string;
  user: { id: number; name: string; email: string };
}

export async function registerUser(name: string, email: string, password: string): Promise<AuthResult> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("User already exists");
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, password: hashed } });
  const token = signToken({ userId: user.id, email: user.email });

  return { token, user: { id: user.id, name: user.name, email: user.email } };
}

export async function loginUser(email: string, password: string): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const token = signToken({ userId: user.id, email: user.email });
  return { token, user: { id: user.id, name: user.name, email: user.email } };
}
