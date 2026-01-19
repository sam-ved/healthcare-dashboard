import { GoogleGenerativeAI } from '@google/generative-ai';
// Initialize Gemini AI - once per application
let geminiInstance = null;
function initializeGemini() {
    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ CRITICAL: GEMINI_API_KEY environment variable is not set');
        throw new Error('GEMINI_API_KEY environment variable is required');
    }
    if (!geminiInstance) {
        geminiInstance = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        console.log('✅ Gemini AI initialized successfully with API key');
    }
    return geminiInstance;
}
const SYSTEM_PROMPT = `You are a Hospital Management System Assistant.
You help users understand hospital workflows, patient registration, appointments, departments, and medical records in simple terms.
You must NOT diagnose diseases, prescribe medicines, or provide emergency medical advice.
If asked for diagnosis or treatment, politely refuse and advise consulting a qualified doctor.

Key responsibilities:
- Explain hospital procedures and workflows
- Help with appointment scheduling guidance
- Clarify medical terminology at a high level
- Assist with navigating the hospital system
- Answer questions about departments and services

Always maintain a professional, helpful tone while staying within safe boundaries.`;
export async function getChatResponse(request) {
    // Validate input
    if (!request.message || request.message.trim().length === 0) {
        console.warn('⚠️ Chat request: Message is empty');
        throw new Error('Message cannot be empty');
    }
    if (request.message.length > 500) {
        console.warn('⚠️ Chat request: Message exceeds 500 character limit');
        throw new Error('Message too long. Please limit to 500 characters');
    }
    // Sanitize input
    const sanitizedMessage = request.message.trim();
    console.log(`📨 Processing chat request from ${request.role}: "${sanitizedMessage.substring(0, 50)}..."`);
    // Build conversation with role context
    const roleContext = `User role: ${request.role}`;
    const fullPrompt = `${SYSTEM_PROMPT}\n\n${roleContext}\n\nUser: ${sanitizedMessage}`;
    try {
        // Initialize Gemini (validates API key)
        const geminiClient = initializeGemini();
        // Create model instance with correct model name
        const model = geminiClient.getGenerativeModel({
            model: 'gemini-1.5-flash', // Use the correct model for free tier
            generationConfig: {
                temperature: 0.5, // Low to medium for consistency
                maxOutputTokens: 300, // Limit response length
            }
        });
        console.log('🔄 Calling Gemini API with gemini-1.5-flash model...');
        // Add timeout wrapper to prevent hanging requests
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => {
            console.error('❌ Gemini request timeout after 10 seconds');
            reject(new Error('Request timeout'));
        }, 10000));
        // Race between Gemini response and timeout
        const response = await Promise.race([
            model.generateContent(fullPrompt),
            timeoutPromise
        ]);
        // Extract text response
        const reply = response.response.text();
        if (!reply || reply.trim().length === 0) {
            console.error('❌ Gemini returned empty response');
            throw new Error('No response generated from AI');
        }
        console.log(`✅ Gemini responded successfully: "${reply.substring(0, 50)}..."`);
        return reply.trim();
    }
    catch (error) {
        // Detailed error logging with context
        console.error('❌ Chat Service Error Details:', {
            message: error.message,
            status: error.status,
            statusText: error.statusText,
            code: error.code,
            timestamp: new Date().toISOString()
        });
        // Handle specific error types
        if (error.message?.includes('timeout') || error.message?.includes('ECONNABORTED')) {
            console.error('⏱️ Request timeout detected');
            throw new Error('Request timeout. Please try again');
        }
        if (error.message?.includes('API key') || error.status === 401) {
            console.error('🔑 API key error detected');
            throw new Error('AI service not properly configured');
        }
        if (error.status === 429 || error.message?.includes('quota')) {
            console.error('⛔ Rate limit or quota exceeded');
            throw new Error('AI service rate limit reached. Please try again later');
        }
        if (error.message?.includes('MODEL_NOT_FOUND') || error.message?.includes('not found') ||
            (error.status === 404 && error.message?.includes('model'))) {
            console.error('❌ Model not found error - verify Gemini API key and model name');
            throw new Error('AI model not available. Please verify configuration');
        }
        // Generic error handler
        console.error('🔴 Unhandled Gemini API error:', error.message || error);
        throw new Error('AI service temporarily unavailable. Please try again');
    }
}
//# sourceMappingURL=chatService.js.map