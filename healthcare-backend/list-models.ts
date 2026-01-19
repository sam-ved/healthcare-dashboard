import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

async function listModels() {
  console.log('📋 Listing Available Gemini Models\n');
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found');
    process.exit(1);
  }
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  try {
    // Try different API versions
    console.log('Attempting to fetch models...\n');
    
    // Method 1: Try direct fetch to list models endpoint
    const apiKey = process.env.GEMINI_API_KEY;
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );
    
    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error('Response:', text);
      process.exit(1);
    }
    
    const data = await response.json();
    
    console.log('✅ Available models:\n');
    console.log('═'.repeat(80));
    
    if (data.models && data.models.length > 0) {
      data.models.forEach((model: any) => {
        console.log(`\n📦 ${model.name}`);
        console.log(`   Display Name: ${model.displayName || 'N/A'}`);
        console.log(`   Description: ${model.description || 'N/A'}`);
        console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
        
        // Check if generateContent is supported
        if (model.supportedGenerationMethods?.includes('generateContent')) {
          console.log(`   ✅ Supports generateContent - CAN USE FOR CHAT`);
        }
      });
      console.log('\n' + '═'.repeat(80));
      
      // Find best model for chat
      const chatModels = data.models.filter((m: any) => 
        m.supportedGenerationMethods?.includes('generateContent')
      );
      
      if (chatModels.length > 0) {
        console.log('\n🎯 RECOMMENDED MODELS FOR CHAT:');
        chatModels.forEach((m: any) => {
          const modelName = m.name.replace('models/', '');
          console.log(`   → ${modelName}`);
        });
        
        // Suggest the first available chat model
        const recommendedModel = chatModels[0].name.replace('models/', '');
        console.log(`\n✨ Update chatService.ts to use: "${recommendedModel}"`);
      }
      
    } else {
      console.log('⚠️ No models found in response');
      console.log('Response:', JSON.stringify(data, null, 2));
    }
    
  } catch (error: any) {
    console.error('\n❌ Error listing models:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    
    console.log('\n💡 Possible issues:');
    console.log('   1. API key is invalid - Get new key from: https://aistudio.google.com/app/apikey');
    console.log('   2. API key restrictions - Check API key settings in Google AI Studio');
    console.log('   3. Billing not enabled - Some models require billing enabled');
    process.exit(1);
  }
}

listModels();
