import "dotenv/config";

const DEFAULT_DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@db:5432/app_db?schema=public";

export const env = {
  PORT: Number(process.env.PORT ?? 3000),
  JWT_SECRET: process.env.JWT_SECRET ?? "supersecretjwt",
  DATABASE_URL: DEFAULT_DATABASE_URL,
};
