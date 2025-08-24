require('dotenv').config();
const OpenAIService = require('./services/openai-service');

async function testOpenAI() {
  console.log('🤖 Testing Tiger AI integration...');
  
  const ai = new OpenAIService();
  
  const result = await ai.analyzeScript(
    "Hey everyone! Today I'm showing you the best coffee brewing method.",
    "youtube"
  );
  
  console.log('✅ Script Analysis Result:', result);
}

testOpenAI().catch(console.error);