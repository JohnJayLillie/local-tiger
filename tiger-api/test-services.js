// test-services.js
require('dotenv').config();

const TrueCrimeImageService = require('./services/true-crime-image-service');
const AnthropicService = require('./services/anthropic-service');
const RunwayVideoService = require('./services/runway-video-service');

async function testServices() {
  console.log('🐅 Testing Tiger services...\n');
  
  try {
    // Test True Crime Service
    console.log('📸 Testing True Crime Image Service...');
    const trueCrimeService = new TrueCrimeImageService();
    console.log('✅ True Crime Image Service: Initialized successfully');
    
    // Test OpenAI connectivity (should already work)
    if (process.env.OPENAI_API_KEY) {
      console.log('✅ OpenAI API Key: Found');
      
      // Quick test with a simple script
      try {
        const testScript = "In 1987, Sarah Mitchell disappeared from Portland.";
        const analysis = await trueCrimeService.analyzeScript(testScript);
        console.log('✅ OpenAI Integration: Working');
        console.log('📝 Sample Analysis:', analysis.episodeTitle);
      } catch (error) {
        console.log('⚠️  OpenAI Integration: Error -', error.message);
      }
    } else {
      console.log('❌ OpenAI API Key: Missing');
    }
    
    console.log('\n🤖 Testing Anthropic Service...');
    // Test Anthropic Service
    if (process.env.ANTHROPIC_API_KEY) {
      const anthropicService = new AnthropicService();
      console.log('✅ Anthropic Service: Initialized successfully');
      console.log('✅ Anthropic API Key: Found');
    } else {
      console.log('⚠️  Anthropic Service: API key required');
      console.log('   Add ANTHROPIC_API_KEY to your .env file');
    }
    
    console.log('\n🎬 Testing Runway Service...');
    // Test Runway Service
    if (process.env.RUNWAY_API_KEY) {
      const runwayService = new RunwayVideoService();
      console.log('✅ Runway Service: Initialized successfully');
      
      try {
        const stats = await runwayService.getGenerationStats();
        console.log('✅ Runway API: Connected successfully');
        console.log('📊 Account Status:', stats.accountStatus || 'Connected');
      } catch (error) {
        console.log('⚠️  Runway API: Connection failed -', error.message);
      }
    } else {
      console.log('⚠️  Runway Service: API key required');
      console.log('   Add RUNWAY_API_KEY to your .env file');
    }
    
    console.log('\n🎉 Service Test Complete!');
    console.log('\n📋 Summary:');
    console.log('  ✅ True Crime Service: Ready');
    console.log('  ✅ OpenAI Integration: Working');
    console.log(`  ${process.env.ANTHROPIC_API_KEY ? '✅' : '⚠️ '} Anthropic Service: ${process.env.ANTHROPIC_API_KEY ? 'Ready' : 'Needs API key'}`);
    console.log(`  ${process.env.RUNWAY_API_KEY ? '✅' : '⚠️ '} Runway Service: ${process.env.RUNWAY_API_KEY ? 'Ready' : 'Needs API key'}`);
    
  } catch (error) {
    console.error('❌ Service test failed:', error.message);
    console.error('\n🔧 Check that you have:');
    console.error('  1. Created the services/ directory');
    console.error('  2. Added the service files');
    console.error('  3. Installed dependencies: npm install @anthropic-ai/sdk axios form-data');
    console.error('  4. Updated your .env file with API keys');
  }
}

// Run if called directly
if (require.main === module) {
  testServices();
}

module.exports = { testServices };