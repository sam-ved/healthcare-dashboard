import { Router } from "express";
import { chatHandler } from "../controllers/chatController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

// POST /api/chat - Send message and get AI response
router.post("/", verifyToken, chatHandler);

export default router;
