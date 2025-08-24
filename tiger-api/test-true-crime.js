// test-true-crime.js - SAVE THIS FILE IN tiger/tiger-api/
require('dotenv').config();

const TrueCrimeImageService = require('./services/true-crime-image-service');
const AnthropicService = require('./services/anthropic-service');
const RunwayVideoService = require('./services/runway-video-service');

// Test script for Tiger True Crime Pipeline
const testScript = `
In 1987, Sarah Mitchell disappeared from downtown Portland after leaving work at the First National Bank. The 28-year-old accountant was last seen walking to her car in the parking garage at 6:15 PM on a rainy October evening.

Detective Robert Johnson led the investigation into what would become one of Portland's most puzzling cases. The case involved multiple suspects including ex-boyfriend Mark Stevens, who had a documented history of stalking behavior and had been seen arguing with Sarah outside her apartment the week before her disappearance.

Another person of interest was neighbor Rick Wilson, a maintenance worker who lived in Sarah's apartment complex. Witnesses reported seeing Rick arguing with Sarah in the lobby the day before she vanished. Security cameras captured him following her to the elevator, though he claimed it was just a coincidence.

Sarah's car was found three days later in a remote area outside the city, but there was no sign of her. Her purse was missing, but her jewelry was left behind. Despite extensive searches involving hundreds of volunteers and multiple law enforcement agencies, Sarah was never found.

The case took a strange turn when Mark Stevens suddenly left town two weeks after Sarah's disappearance, claiming he got a job offer in Seattle. Detective Johnson found this suspicious, especially since Stevens had been unemployed for months. However, when questioned by Seattle police, Stevens had an alibi for the night Sarah disappeared - he was at a bar with several witnesses.

Rick Wilson also became less cooperative as the investigation progressed. He initially seemed helpful, even joining search parties, but later refused to take a polygraph test. His behavior became increasingly erratic, and he moved out of the apartment complex within a month of Sarah's disappearance.

Twenty-five years later, the case remains unsolved. Sarah's family continues to search for answers, and the Portland Police Department still considers it an active investigation. Detective Johnson, now retired, believes the answer lies with someone who hasn't come forward yet.

What happened to Sarah Mitchell that rainy October night? Was it someone she knew, or a random crime of opportunity? The truth may still be out there, waiting to be discovered.
`;

// Initialize services
const trueCrimeService = new TrueCrimeImageService();
const anthropicService = new AnthropicService();
const runwayService = new RunwayVideoService();

async function testImageGeneration() {
  console.log('🐅 Testing Tiger True Crime Image Generation...\n');
  
  try {
    console.log('📸 Generating complete image set...');
    const startTime = Date.now();
    
    const imageSet = await trueCrimeService.generateEpisodeImageSet(testScript);
    
    const generationTime = Date.now() - startTime;
    
    console.log('✅ Image generation complete!');
    console.log(`⏱️  Generation time: ${(generationTime / 1000).toFixed(1)} seconds`);
    console.log(`📊 Total images: ${imageSet.metadata.totalImages}`);
    console.log(`🎬 Episode: ${imageSet.analysis.episodeTitle}`);
    console.log(`📍 Location: ${imageSet.analysis.masterLocation}`);
    console.log(`👥 Characters: ${imageSet.analysis.segments.length}`);
    
    console.log('\n📸 Generated Images:');
    console.log(`  🖼️  Thumbnail: ${imageSet.thumbnail.url}`);
    console.log(`  🏞️  Master Background: ${imageSet.masterBackground.url}`);
    
    imageSet.portraits.forEach((portrait, index) => {
      console.log(`  👤 Portrait ${index + 1}: ${portrait.subject} (${portrait.role})`);
      console.log(`     ${portrait.url}`);
    });
    
    return imageSet;
    
  } catch (error) {
    console.error('❌ Image generation failed:', error.message);
    throw error;
  }
}

async function testAdvancedAnalysis() {
  console.log('\n🤖 Testing Advanced AI Analysis...\n');
  
  try {
    console.log('🔍 Running Claude analysis...');
    const claudeAnalysis = await anthropicService.analyzeScriptAdvanced(testScript);
    
    console.log('✅ Claude analysis complete!');
    console.log(`📊 Content Quality Score: ${claudeAnalysis.contentQuality.score}/100`);
    console.log(`👥 Characters Found: ${claudeAnalysis.visualRequirements.characterProfiles.length}`);
    console.log(`📍 Locations Found: ${claudeAnalysis.visualRequirements.locations.length}`);
    console.log(`⚖️  Compliance Level: ${claudeAnalysis.complianceCheck.sensitivityLevel}`);
    
    return claudeAnalysis;
    
  } catch (error) {
    console.error('❌ Advanced analysis failed:', error.message);
    throw error;
  }
}

async function testVideoGeneration(imageSet) {
  console.log('\n🎬 Testing Video Generation...\n');
  
  try {
    console.log('🎥 Generating YouTube video...');
    const video = await runwayService.generateVideoFromScript(
      testScript,
      imageSet,
      'youtube'
    );
    
    console.log('✅ Video generation complete!');
    console.log(`🎬 Video URL: ${video.videoUrl}`);
    console.log(`⏱️  Duration: ${video.duration} seconds`);
    console.log(`📺 Platform: ${video.platform}`);
    console.log(`📹 Segments: ${video.segments}`);
    
    return video;
    
  } catch (error) {
    console.error('❌ Video generation failed:', error.message);
    throw error;
  }
}

async function testCompletePipeline() {
  console.log('🐅 TIGER TRUE CRIME PIPELINE TEST\n');
  console.log('🎬 Testing complete episode generation...\n');
  
  const overallStart = Date.now();
  
  try {
    // Step 1: Generate Images
    console.log('STEP 1: IMAGE GENERATION');
    console.log('=' .repeat(50));
    const imageSet = await testImageGeneration();
    
    // Step 2: Advanced Analysis  
    console.log('\nSTEP 2: ADVANCED AI ANALYSIS');
    console.log('=' .repeat(50));
    const analysis = await testAdvancedAnalysis();
    
    // Step 3: Video Generation
    console.log('\nSTEP 3: VIDEO GENERATION');
    console.log('=' .repeat(50));
    const video = await testVideoGeneration(imageSet);
    
    // Final Results
    const totalTime = Date.now() - overallStart;
    
    console.log('\n🎉 COMPLETE PIPELINE SUCCESS!');
    console.log('=' .repeat(50));
    console.log(`⏱️  Total Time: ${(totalTime / 1000 / 60).toFixed(1)} minutes`);
    console.log(`📸 Images Generated: ${imageSet.metadata.totalImages}`);
    console.log(`🎬 Video Generated: ${video.platform} format`);
    console.log(`📊 Quality Score: ${analysis.contentQuality.score}/100`);
    console.log(`⚖️  Compliance: ${analysis.complianceCheck.sensitivityLevel} sensitivity`);
    
    console.log('\n🚀 Tiger is ready for production!');
    
    return {
      imageSet,
      analysis, 
      video,
      totalTime,
      success: true
    };
    
  } catch (error) {
    console.error('\n❌ PIPELINE TEST FAILED');
    console.error('Error:', error.message);
    
    return {
      error: error.message,
      success: false
    };
  }
}

// Individual test functions
async function testImagesOnly() {
  console.log('🐅 Testing Images Only...\n');
  return await testImageGeneration();
}

async function testAnalysisOnly() {
  console.log('🐅 Testing Analysis Only...\n');
  return await testAdvancedAnalysis();
}

// Run based on command line argument
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'complete';
  
  switch (command) {
    case 'images':
      await testImagesOnly();
      break;
    case 'analysis':
      await testAnalysisOnly();
      break;
    case 'complete':
    default:
      await testCompletePipeline();
      break;
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { 
  testScript, 
  testCompletePipeline,
  testImageGeneration,
  testAdvancedAnalysis,
  testVideoGeneration
};