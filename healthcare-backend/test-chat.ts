import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

async function testChat() {
  console.log('🧪 Testing Chat with gemini-2.0-flash-lite\n');
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-lite',
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 300,
    }
  });
  
  const SYSTEM_PROMPT = `You are a Hospital Management System Assistant.
You help users understand hospital workflows, patient registration, appointments, departments, and medical records in simple terms.
You must NOT diagnose diseases, prescribe medicines, or provide emergency medical advice.`;

  const testMessages = [
    "Which doctors are available today?",
    "What details are needed for patient registration?"
  ];
  
  for (const msg of testMessages) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`❓ Question: "${msg}"`);
    console.log('─'.repeat(60));
    
    try {
      const fullPrompt = `${SYSTEM_PROMPT}\n\nUser role: RECEPTIONIST\n\nUser: ${msg}`;
      
      const result = await model.generateContent(fullPrompt);
      const response = result.response.text();
      
      console.log(`✅ Response:\n${response}`);
      
    } catch (error: any) {
      console.error(`❌ Error: ${error.message}`);
    }
  }
  
  console.log(`\n${'═'.repeat(60)}`);
  console.log('🎉 Tests complete!');
}

testChat();
