import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ GEMINI_API_KEY not set');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testModels() {
  console.log('🔍 Testing available Gemini models...\n');

  const models = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro',
    'gemini-pro',
    'gemini-pro-vision'
  ];

  for (const modelName of models) {
    try {
      console.log(`Testing: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const response = await Promise.race([
        model.generateContent('What is 2+2?'),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);

      const text = response.response.text();
      console.log(`✅ ${modelName} works! Response: ${text.substring(0, 50)}...\n`);
    } catch (error: any) {
      console.log(`❌ ${modelName} failed: ${error.message}\n`);
    }
  }
}

testModels().catch(console.error);
