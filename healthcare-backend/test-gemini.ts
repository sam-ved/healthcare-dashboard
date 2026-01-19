import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

async function testGeminiAPI() {
  console.log('🧪 Testing Gemini API Integration\n');
  
  // Step 1: Check API Key
  console.log('Step 1: Checking API Key...');
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in environment');
    process.exit(1);
  }
  console.log('✅ API Key found:', process.env.GEMINI_API_KEY.substring(0, 10) + '...');
  
  // Step 2: Initialize Client
  console.log('\nStep 2: Initializing Gemini Client...');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log('✅ Client initialized');
  
  // Step 3: Test with gemini-1.5-flash model
  console.log('\nStep 3: Testing gemini-1.5-flash model...');
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 300,
      }
    });
    
    const prompt = 'You are a Hospital Management System Assistant. Explain in 2 sentences what patient registration involves.';
    
    console.log('📤 Sending request to Gemini...');
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('✅ SUCCESS! Gemini responded:');
    console.log('━'.repeat(60));
    console.log(text);
    console.log('━'.repeat(60));
    
    console.log('\n🎉 All tests passed! Gemini API is working correctly.');
    process.exit(0);
    
  } catch (error: any) {
    console.error('\n❌ ERROR with gemini-1.5-flash:');
    console.error('Message:', error.message);
    console.error('Status:', error.status);
    console.error('Details:', error);
    
    // Try gemini-pro as fallback
    console.log('\n⚠️ Trying fallback model: gemini-pro...');
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-pro',
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 300,
        }
      });
      
      const prompt = 'You are a Hospital Management System Assistant. Explain in 2 sentences what patient registration involves.';
      
      console.log('📤 Sending request to Gemini...');
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      console.log('✅ SUCCESS with gemini-pro! Response:');
      console.log('━'.repeat(60));
      console.log(text);
      console.log('━'.repeat(60));
      
      console.log('\n⚠️ NOTE: gemini-pro works but gemini-1.5-flash does not.');
      console.log('Consider updating chatService.ts to use "gemini-pro" instead.');
      process.exit(0);
      
    } catch (fallbackError: any) {
      console.error('\n❌ Fallback also failed:');
      console.error('Message:', fallbackError.message);
      console.error('Status:', fallbackError.status);
      console.error('\n🔴 CRITICAL: API key may be invalid or models not accessible.');
      console.error('Please get a new API key from: https://aistudio.google.com/app/apikey');
      process.exit(1);
    }
  }
}

testGeminiAPI();
