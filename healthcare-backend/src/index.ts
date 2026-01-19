import express from "express"
import cors from "cors"
import helmet from "helmet"
import { env } from "./config/env.js"
import authRoutes from "./routes/authRoutes.js"
import patientRoutes from "./routes/patientRoutes.js"
import employeeRoutes from "./routes/employeeRoutes.js"
import visitRoutes from "./routes/visitRoutes.js"
import surgeryRoutes from "./routes/surgeryRoutes.js"
import statsRoutes from "./routes/statsRoutes.js"
import workflowRoutes from "./routes/workflowRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.use("/auth", authRoutes)
app.use("/auth", employeeRoutes)
app.use("/patients", workflowRoutes)
app.use("/", patientRoutes)
app.use("/visits", visitRoutes)
app.use("/surgeries", surgeryRoutes)
app.use("/stats", statsRoutes)
app.use("/api/chat", chatRoutes)

app.get("/health", (_, res) => res.json({ status: "ok" }))

app.listen(env.PORT, () => {
  console.log(`API running on port ${env.PORT}`)
})
