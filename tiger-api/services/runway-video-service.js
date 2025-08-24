// services/runway-video-service.js
const axios = require('axios');

class RunwayVideoService {
  constructor() {
    this.apiKey = process.env.RUNWAYML_API_SECRET || process.env.RUNWAY_API_KEY;
    this.baseURL = 'https://api.dev.runwayml.com/v1';
    this.apiVersion = '2024-11-06';
    
    this.platformSpecs = {
      youtube: {
        width: 1920,
        height: 1080,
        aspectRatio: '16:9',
        maxDuration: 600, // 10 minutes
        fps: 30
      },
      tiktok: {
        width: 1080,
        height: 1920, 
        aspectRatio: '9:16',
        maxDuration: 180, // 3 minutes
        fps: 30
      },
      instagram: {
        width: 1080,
        height: 1080,
        aspectRatio: '1:1',
        maxDuration: 90, // 90 seconds for reels
        fps: 30
      },
      shorts: {
        width: 1080,
        height: 1920,
        aspectRatio: '9:16', 
        maxDuration: 60, // 60 seconds
        fps: 30
      }
    };
  }

  /**
   * Generate video from script and images using Runway Gen-4
   */
  async generateVideoFromScript(script, imageSet, platform = 'youtube') {
    try {
      const platformSpec = this.platformSpecs[platform];
      if (!platformSpec) {
        throw new Error(`Unsupported platform: ${platform}`);
      }

      console.log(`🎬 Generating ${platform} video from script...`);
      
      // Use the thumbnail as the primary image for video generation
      const primaryImage = imageSet.thumbnail.url;
      
      // Create a documentary-style prompt based on the script and analysis
      const prompt = this.createDocumentaryPrompt(script, imageSet.analysis);
      
      console.log(`📹 Generating video with Gen-3 Alpha...`);
      const video = await this.generateWithGen3(prompt, primaryImage, { ...platformSpec, platform });
      
      return {
        videoUrl: video.url,
        platform: platform,
        duration: video.duration || 10,
        specifications: platformSpec,
        segments: 1,
        metadata: {
          generatedAt: new Date().toISOString(),
          script: script.substring(0, 100) + '...',
          imageCount: imageSet.portraits.length,
          model: 'gen3a'
        }
      };
      
    } catch (error) {
      throw new Error(`Video generation failed: ${error.message}`);
    }
  }

  /**
   * Generate video using Runway Gen-4 Turbo
   */
  async generateWithGen4(prompt, imageUrl, platformSpec) {
    const requestData = {
      promptText: prompt,
      promptImage: imageUrl,
      model: 'gen4_turbo',
      duration: Math.min(10, platformSpec.maxDuration), // Max 10 seconds for Gen-4
      aspectRatio: platformSpec.aspectRatio,
      seed: Math.floor(Math.random() * 1000000)
    };

    try {
      console.log('🚀 Starting Gen-4 video generation...');
      
      const response = await axios.post(`${this.baseURL}/image_to_video`, requestData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-Runway-Version': this.apiVersion
        }
      });

      console.log('⏳ Polling for video completion...');
      const videoResult = await this.pollForCompletion(response.data.id);
      
      return {
        id: response.data.id,
        url: videoResult,
        duration: 10, // Gen-4 default duration
        model: 'gen4_turbo'
      };
      
    } catch (error) {
      console.error('❌ Gen-4 generation error:', error.response?.data || error.message);
      throw new Error(`Gen-4 generation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Create documentary-style prompt for true crime content
   */
  createDocumentaryPrompt(script, analysis) {
    const basePrompt = `Documentary style true crime video: ${analysis.episodeTitle}. `;
    
    const styleElements = [
      'Professional documentary cinematography',
      'Subtle camera movements',
      'Serious investigative tone',
      'Crime scene establishing shots',
      'Documentary lighting',
      'Respectful treatment of subject matter'
    ];
    
    const visualElements = [
      'Archival footage aesthetic',
      'Police investigation visuals',
      'Location establishing shots',
      'Professional news broadcast style'
    ];
    
    return basePrompt + styleElements.join(', ') + '. ' + visualElements.join(', ') + '.';
  }

  /**
   * Poll Runway API for task completion
   */
  async pollForCompletion(taskId, maxAttempts = 60) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await axios.get(`${this.baseURL}/tasks/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'X-Runway-Version': this.apiVersion
          }
        });
        
        const { status, output } = response.data;
        
        console.log(`📊 Status check ${attempt + 1}/${maxAttempts}: ${status}`);
        
        if (status === 'SUCCEEDED') {
          return output[0]; // Return video URL
        } else if (status === 'FAILED') {
          throw new Error(`Video generation failed: ${response.data.failure_reason || 'Unknown error'}`);
        }
        
        // Wait before next poll (Gen-4 takes longer)
        await this.delay(10000); // 10 second intervals
        
      } catch (error) {
        if (attempt === maxAttempts - 1) {
          throw new Error(`Polling timeout after ${maxAttempts} attempts: ${error.message}`);
        }
        console.log(`⚠️  Poll attempt ${attempt + 1} failed, retrying...`);
        await this.delay(5000);
      }
    }
    
    throw new Error('Video generation timeout - please check Runway dashboard');
  }

  /**
   * Generate multiple platform versions (simplified)
   */
  async generateMultiPlatform(script, imageSet, platforms = ['youtube']) {
    const results = {};
    
    // For now, generate one platform to avoid rate limits
    const primaryPlatform = platforms[0] || 'youtube';
    
    try {
      console.log(`🎯 Generating for ${primaryPlatform}...`);
      results[primaryPlatform] = await this.generateVideoFromScript(script, imageSet, primaryPlatform);
      
      // Note about other platforms
      for (const platform of platforms.slice(1)) {
        results[platform] = {
          note: 'Multi-platform generation limited to avoid API rate limits',
          recommendation: 'Generate individually for each platform',
          specs: this.platformSpecs[platform]
        };
      }
      
    } catch (error) {
      console.error(`❌ Failed to generate for ${primaryPlatform}:`, error.message);
      results[primaryPlatform] = { error: error.message };
    }
    
    return results;
  }

  /**
   * Create text-to-video generation (no images required)
   */
  async generateTextToVideo(script, platform = 'youtube') {
    const platformSpec = this.platformSpecs[platform];
    
    // Create enhanced prompt from script
    const prompt = `
      Professional true crime documentary video based on: "${script.substring(0, 200)}..."
      
      Style: Documentary cinematography, investigative journalism aesthetic, serious tone.
      Visuals: Crime scene locations, archival footage style, professional news broadcast quality.
      Movement: Subtle camera movements, slow pans, documentary-style establishing shots.
      Lighting: Professional documentary lighting, realistic but dramatic.
      Mood: Mysterious, respectful, investigative journalism standard.
    `;
    
    try {
      const response = await axios.post(`${this.baseURL}/tasks`, {
        promptText: prompt.trim(),
        model: 'gen4_turbo',
        duration: Math.min(10, platformSpec.maxDuration),
        aspectRatio: platformSpec.aspectRatio
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const videoUrl = await this.pollForCompletion(response.data.id);
      
      return {
        videoUrl: videoUrl,
        platform: platform,
        generationType: 'text_to_video',
        script: script.substring(0, 100) + '...',
        model: 'gen4_turbo'
      };
      
    } catch (error) {
      throw new Error(`Text-to-video generation failed: ${error.message}`);
    }
  }

  /**
   * Get generation status and usage statistics
   */
  async getGenerationStats() {
    try {
      // Test API connectivity with a simple request
      const response = await axios.get(`${this.baseURL}/tasks?limit=1`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      return {
        accountStatus: 'Connected',
        apiEndpoint: this.baseURL,
        lastCheck: new Date().toISOString(),
        connectivity: 'Working'
      };
      
    } catch (error) {
      return {
        error: `API connection failed: ${error.response?.status} ${error.response?.statusText}`,
        message: error.response?.data?.message || error.message,
        timestamp: new Date().toISOString(),
        suggestion: 'Check API key and endpoint URL'
      };
    }
  }

  /**
   * Test API connectivity
   */
  async testConnection() {
    try {
      // Test with Gen-3 Alpha (available model)
      const response = await axios.post(`${this.baseURL}/text_to_video`, {
        promptText: "A simple test video",
        model: "gen3a",
        ratio: "16:9", 
        duration: 5
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-Runway-Version': this.apiVersion
        }
      });
      
      return {
        success: true,
        status: response.status,
        message: 'Runway API connection successful',
        endpoint: this.baseURL,
        taskId: response.data.id,
        model: 'gen3a_turbo'
      };
      
    } catch (error) {
      // If gen3a_turbo fails, try gen3a
      if (error.response?.data?.error?.includes('gen3a_turbo')) {
        try {
          const response2 = await axios.post(`${this.baseURL}/text_to_video`, {
            promptText: "A simple test video",
            model: "gen3a",
            ratio: "1280:720", 
            duration: 5
          }, {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
              'X-Runway-Version': this.apiVersion
            }
          });
          
          return {
            success: true,
            status: response2.status,
            message: 'Runway API connection successful (fallback to gen3a)',
            endpoint: this.baseURL,
            taskId: response2.data.id,
            model: 'gen3a'
          };
        } catch (error2) {
          // Return details of both attempts
          return {
            success: false,
            status: error2.response?.status || 'No response',
            message: 'Both gen3a_turbo and gen3a failed',
            details: {
              gen3a_turbo_error: error.response?.data,
              gen3a_error: error2.response?.data
            },
            endpoint: this.baseURL,
            suggestion: 'Check available models for your account'
          };
        }
      }
      
      return {
        success: false,
        status: error.response?.status || 'No response',
        message: error.response?.data?.message || error.message,
        details: error.response?.data || null,
        endpoint: this.baseURL,
        suggestion: 'Check available models for your account'
      };
    }
  }

  /**
   * Utility: Delay function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = RunwayVideoService;