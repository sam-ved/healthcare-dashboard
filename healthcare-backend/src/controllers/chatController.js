import { getChatResponse } from "../services/chatService.js";
// Simple in-memory rate limiting (per user)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;
function checkRateLimit(userId) {
    const now = Date.now();
    const userLimit = rateLimitMap.get(userId);
    if (!userLimit || now > userLimit.resetTime) {
        rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }
    if (userLimit.count >= MAX_REQUESTS_PER_WINDOW) {
        return false;
    }
    userLimit.count++;
    return true;
}
export async function chatHandler(req, res) {
    try {
        // Ensure user is authenticated
        if (!req.user || !req.user.userId) {
            console.warn('⚠️ Chat request rejected: No authentication');
            return res.status(401).json({ error: "Authentication required" });
        }
        // Rate limiting
        if (!checkRateLimit(req.user.userId)) {
            console.warn(`⚠️ Rate limit exceeded for user ${req.user.userId}`);
            return res.status(429).json({
                error: "Too many requests. Please wait a moment before trying again"
            });
        }
        const { message, role } = req.body;
        // Validation - message
        if (!message || typeof message !== 'string') {
            console.warn('⚠️ Chat request: Invalid message field');
            return res.status(400).json({ error: "Message is required" });
        }
        if (message.trim().length === 0) {
            console.warn('⚠️ Chat request: Empty message');
            return res.status(400).json({ error: "Message cannot be empty" });
        }
        if (message.length > 500) {
            console.warn('⚠️ Chat request: Message exceeds limit');
            return res.status(400).json({ error: "Message too long (max 500 characters)" });
        }
        // Validation - role
        const validRoles = ['RECEPTIONIST', 'DOCTOR', 'NURSE', 'PATIENT'];
        if (!role || !validRoles.includes(role)) {
            console.warn(`⚠️ Chat request: Invalid role "${role}"`);
            return res.status(400).json({ error: "Valid role is required" });
        }
        console.log(`📨 Chat request from user ${req.user.userId} (${role}): "${message.substring(0, 40)}..."`);
        // Get chat response from Gemini
        const reply = await getChatResponse({ message, role });
        // Success response
        console.log(`✅ Chat response sent to user ${req.user.userId}`);
        return res.json({ reply });
    }
    catch (error) {
        console.error('❌ Chat handler error:', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        // Handle specific errors
        if (error.message.includes('not configured')) {
            console.error('🔑 Configuration error detected');
            return res.status(500).json({
                error: "AI service is not properly configured"
            });
        }
        if (error.message.includes('timeout')) {
            console.error('⏱️ Timeout error detected');
            return res.status(504).json({
                error: "Request timeout. Please try again"
            });
        }
        if (error.message.includes('Too many requests')) {
            console.error('⛔ Rate limit error');
            return res.status(429).json({ error: error.message });
        }
        // Generic error response
        const errorMessage = error.message || "Failed to process chat request";
        console.error(`🔴 Returning error to client: ${errorMessage}`);
        return res.status(500).json({
            error: errorMessage
        });
    }
}
//# sourceMappingURL=chatController.js.map