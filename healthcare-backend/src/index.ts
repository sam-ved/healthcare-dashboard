import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api", patientRoutes);

app.get("/health", (_, res) => res.json({ status: "ok" }));

app.listen(env.PORT, () => {
  console.log(`API running on port ${env.PORT}`);
});
