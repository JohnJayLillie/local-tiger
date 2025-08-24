// routes/tiger-pipeline.js
const express = require('express');
const router = express.Router();
const TrueCrimeImageService = require('../services/true-crime-image-service');
const AnthropicService = require('../services/anthropic-service');
const RunwayVideoService = require('../services/runway-video-service');

// Initialize services
const trueCrimeService = new TrueCrimeImageService();
const anthropicService = new AnthropicService();
const runwayService = new RunwayVideoService();

/**
 * Complete Tiger Pipeline - Script to Video
 * POST /api/tiger/generate-episode
 */
router.post('/generate-episode', async (req, res) => {
  try {
    const { script, platform = 'youtube', userId } = req.body;
    
    if (!script) {
      return res.status(400).json({ error: 'Script is required' });
    }

    console.log('🐅 Starting Tiger pipeline for true crime episode...');
    const startTime = Date.now();

    // Step 1: Dual AI Analysis
    console.log('🔍 Running dual AI analysis...');
    const [claudeAnalysis, imageSet] = await Promise.all([
      anthropicService.analyzeScriptAdvanced(script),
      trueCrimeService.generateEpisodeImageSet(script)
    ]);

    // Step 2: AI Comparison and Optimization
    console.log('🤖 Synthesizing AI analyses...');
    const synthesis = await anthropicService.compareWithGPT(
      claudeAnalysis, 
      imageSet.analysis
    );

    // Step 3: Compliance Check
    console.log('✅ Running compliance analysis...');
    const compliance = await anthropicService.analyzeCompliance(
      script, 
      imageSet.portraits.map(p => p.url)
    );

    if (compliance.overallCompliance === 'fail') {
      return res.status(400).json({
        error: 'Content failed compliance check',
        compliance: compliance,
        suggestions: compliance.alternativeApproaches
      });
    }

    // Step 4: Video Generation
    console.log('🎬 Generating video content...');
    const video = await runwayService.generateVideoFromScript(
      synthesis.synthesizedRecommendation.finalScript || script,
      imageSet,
      platform
    );

    // Step 5: Store results
    const result = {
      episodeId: `tiger_${Date.now()}`,
      generationTime: Date.now() - startTime,
      script: {
        original: script,
        optimized: synthesis.synthesizedRecommendation.finalScript
      },
      analysis: {
        claude: claudeAnalysis,
        synthesis: synthesis,
        compliance: compliance
      },
      assets: {
        images: {
          thumbnail: imageSet.thumbnail,
          masterBackground: imageSet.masterBackground,
          portraits: imageSet.portraits,
          totalImages: imageSet.metadata.totalImages
        },
        video: video
      },
      platform: platform,
      userId: userId,
      createdAt: new Date().toISOString()
    };

    // Log analytics
    await logAnalyticsEvent({
      event: 'episode_generated',
      userId: userId,
      platform: platform,
      generationTime: result.generationTime,
      imageCount: imageSet.metadata.totalImages,
      complianceStatus: compliance.overallCompliance
    });

    res.json({
      success: true,
      message: 'True crime episode generated successfully',
      data: result
    });

  } catch (error) {
    console.error('❌ Tiger pipeline error:', error);
    res.status(500).json({
      error: 'Episode generation failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Generate Images Only
 * POST /api/tiger/generate-images
 */
router.post('/generate-images', async (req, res) => {
  try {
    const { script, userId } = req.body;
    
    console.log('📸 Generating image set for true crime content...');
    const imageSet = await trueCrimeService.generateEpisodeImageSet(script);
    
    await logAnalyticsEvent({
      event: 'images_generated',
      userId: userId,
      imageCount: imageSet.metadata.totalImages
    });
    
    res.json({
      success: true,
      data: imageSet
    });
    
  } catch (error) {
    console.error('❌ Image generation error:', error);
    res.status(500).json({
      error: 'Image generation failed',
      message: error.message
    });
  }
});

/**
 * Analyze Script with Dual AI
 * POST /api/tiger/analyze-script
 */
router.post('/analyze-script', async (req, res) => {
  try {
    const { script, userId } = req.body;
    
    console.log('🔍 Running advanced script analysis...');
    const [claudeAnalysis, basicAnalysis] = await Promise.all([
      anthropicService.analyzeScriptAdvanced(script),
      trueCrimeService.analyzeScript(script)
    ]);
    
    const synthesis = await anthropicService.compareWithGPT(
      claudeAnalysis,
      basicAnalysis
    );
    
    res.json({
      success: true,
      data: {
        claude: claudeAnalysis,
        basic: basicAnalysis,
        synthesis: synthesis
      }
    });
    
  } catch (error) {
    console.error('❌ Script analysis error:', error);
    res.status(500).json({
      error: 'Script analysis failed',
      message: error.message
    });
  }
});

/**
 * Generate Video Only (from existing images)
 * POST /api/tiger/generate-video
 */
router.post('/generate-video', async (req, res) => {
  try {
    const { script, imageSet, platform = 'youtube', userId } = req.body;
    
    console.log(`🎬 Generating ${platform} video...`);
    const video = await runwayService.generateVideoFromScript(
      script,
      imageSet,
      platform
    );
    
    await logAnalyticsEvent({
      event: 'video_generated',
      userId: userId,
      platform: platform,
      duration: video.duration
    });
    
    res.json({
      success: true,
      data: video
    });
    
  } catch (error) {
    console.error('❌ Video generation error:', error);
    res.status(500).json({
      error: 'Video generation failed',
      message: error.message
    });
  }
});

/**
 * Multi-Platform Generation
 * POST /api/tiger/generate-multiplatform
 */
router.post('/generate-multiplatform', async (req, res) => {
  try {
    const { 
      script, 
      platforms = ['youtube', 'tiktok', 'instagram'],
      userId 
    } = req.body;
    
    console.log('🌐 Generating multi-platform content...');
    
    // Generate image set once
    const imageSet = await trueCrimeService.generateEpisodeImageSet(script);
    
    // Generate videos for each platform
    const results = await runwayService.generateMultiPlatform(
      script,
      imageSet,
      platforms
    );
    
    await logAnalyticsEvent({
      event: 'multiplatform_generated',
      userId: userId,
      platforms: platforms,
      successCount: Object.values(results).filter(r => !r.error).length
    });
    
    res.json({
      success: true,
      data: {
        imageSet: imageSet,
        videos: results
      }
    });
    
  } catch (error) {
    console.error('❌ Multi-platform generation error:', error);
    res.status(500).json({
      error: 'Multi-platform generation failed',
      message: error.message
    });
  }
});

/**
 * Compliance Check
 * POST /api/tiger/check-compliance
 */
router.post('/check-compliance', async (req, res) => {
  try {
    const { script, imageDescriptions = [], userId } = req.body;
    
    console.log('✅ Running compliance analysis...');
    const compliance = await anthropicService.analyzeCompliance(
      script,
      imageDescriptions
    );
    
    res.json({
      success: true,
      data: compliance
    });
    
  } catch (error) {
    console.error('❌ Compliance check error:', error);
    res.status(500).json({
      error: 'Compliance check failed',
      message: error.message
    });
  }
});

/**
 * Plan Content Series
 * POST /api/tiger/plan-series
 */
router.post('/plan-series', async (req, res) => {
  try {
    const { script, seriesGoals, userId } = req.body;
    
    console.log('📋 Planning content series...');
    const seriesPlan = await anthropicService.planContentSeries(
      script,
      seriesGoals
    );
    
    res.json({
      success: true,
      data: seriesPlan
    });
    
  } catch (error) {
    console.error('❌ Series planning error:', error);
    res.status(500).json({
      error: 'Series planning failed',
      message: error.message
    });
  }
});

/**
 * Get Pipeline Status
 * GET /api/tiger/status
 */
router.get('/status', async (req, res) => {
  try {
    const [runwayStats] = await Promise.all([
      runwayService.getGenerationStats()
    ]);
    
    res.json({
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        services: {
          trueCrime: 'operational',
          anthropic: 'operational',
          runway: runwayStats.error ? 'error' : 'operational'
        },
        runway: runwayStats
      }
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Status check failed',
      message: error.message
    });
  }
});

/**
 * Utility function for analytics logging
 */
async function logAnalyticsEvent(eventData) {
  try {
    // This would integrate with your analytics system
    console.log('📊 Analytics:', eventData);
    
    // Example: Store in database
    // await supabase.from('analytics_events').insert(eventData);
    
  } catch (error) {
    console.error('Analytics logging failed:', error);
  }
}

module.exports = router;