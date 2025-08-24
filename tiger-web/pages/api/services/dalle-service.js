// tiger-web/pages/api/services/dalle-service.js
// Real DALL-E integration service for Tiger True Crime platform

import OpenAI from 'openai/index.mjs';

export class TigerDalleService {
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Optimized DALL-E-3 configuration for true crime content
    this.config = {
      model: "dall-e-3",
      size: "1024x1024",
      quality: "hd",
      style: "natural", // Photorealistic for documentary feel
      n: 1
    };

    // True crime specific prompt templates
    this.prompts = {
      thumbnail: "Professional true crime documentary thumbnail for '{title}'. Dark atmospheric lighting, dramatic composition, text overlay space at top. Documentary poster style, high contrast, moody shadows. Netflix true crime aesthetic, professional quality, non-graphic, respectful treatment.",
      
      character: "Professional documentary headshot portrait of {name}, {description}. Neutral background, soft professional lighting, serious expression. High-quality interview subject style, documentary photography, non-graphic, respectful treatment.",
      
      location: "Atmospheric establishing shot of {location}. {time_period} setting, cinematic lighting, slightly desaturated colors. Documentary location photography style, wide composition, moody atmosphere, non-graphic.",
      
      evidence: "Professional evidence photograph showing {item}. Clean forensic photography style, proper lighting, clinical presentation. Documentary evidence room aesthetic, non-graphic, respectful treatment."
    };
  }

  /**
   * Generate all images for a true crime episode
   */
  async generateEpisodeImages(episodeData) {
    console.log(`🎨 Starting DALL-E generation for: ${episodeData.title}`);
    
    const startTime = Date.now();
    const results = {
      thumbnail: null,
      characters: [],
      locations: [],
      evidence: [],
      metadata: {
        started_at: new Date().toISOString(),
        episode_title: episodeData.title
      }
    };

    try {
      // 1. Generate thumbnail (most important)
      console.log('📸 Generating thumbnail...');
      results.thumbnail = await this.generateImage('thumbnail', { 
        title: episodeData.title 
      });
      await this.delay(1000);

      // 2. Generate character portraits
      if (episodeData.characters && episodeData.characters.length > 0) {
        console.log(`👥 Generating ${episodeData.characters.length} character portraits...`);
        for (const character of episodeData.characters.slice(0, 3)) { // Limit to 3
          const portrait = await this.generateImage('character', {
            name: character.name,
            description: character.description || `${character.role || 'person'}, serious expression`
          });
          if (portrait) {
            results.characters.push({
              ...portrait,
              character_name: character.name,
              character_role: character.role
            });
          }
          await this.delay(1000);
        }
      }

      // 3. Generate location shots
      if (episodeData.locations && episodeData.locations.length > 0) {
        console.log(`📍 Generating ${episodeData.locations.length} location shots...`);
        for (const location of episodeData.locations.slice(0, 2)) { // Limit to 2
          const locationShot = await this.generateImage('location', {
            location: location.name,
            time_period: episodeData.time_period || '1990s'
          });
          if (locationShot) {
            results.locations.push({
              ...locationShot,
              location_name: location.name,
              significance: location.significance
            });
          }
          await this.delay(1000);
        }
      }

      // 4. Generate evidence photos (optional)
      if (episodeData.evidence && episodeData.evidence.length > 0) {
        console.log(`🔍 Generating ${episodeData.evidence.length} evidence photos...`);
        for (const evidenceItem of episodeData.evidence.slice(0, 1)) { // Limit to 1
          const evidencePhoto = await this.generateImage('evidence', {
            item: evidenceItem.description || evidenceItem.item
          });
          if (evidencePhoto) {
            results.evidence.push({
              ...evidencePhoto,
              description: evidenceItem.description
            });
          }
          await this.delay(1000);
        }
      }

      const endTime = Date.now();
      const durationSeconds = Math.round((endTime - startTime) / 1000);
      
      results.metadata.completed_at = new Date().toISOString();
      results.metadata.total_images = this.countImages(results);
      results.metadata.generation_time_seconds = durationSeconds;

      console.log(`✅ Generated ${results.metadata.total_images} images in ${durationSeconds}s`);

      return {
        success: true,
        images: results,
        generation_time: `${Math.floor(durationSeconds/60)}m ${durationSeconds%60}s`
      };

    } catch (error) {
      console.error('❌ DALL-E generation failed:', error);
      return {
        success: false,
        error: error.message,
        images: null
      };
    }
  }

  /**
   * Generate single image with type and variables
   */
  async generateImage(type, variables) {
    try {
      let prompt = this.prompts[type];
      
      // Replace variables in template
      Object.keys(variables).forEach(key => {
        const regex = new RegExp(`{${key}}`, 'g');
        prompt = prompt.replace(regex, variables[key]);
      });

      console.log(`📸 Generating ${type}: ${prompt.substring(0, 50)}...`);

      const response = await this.openai.images.generate({
        ...this.config,
        prompt: prompt
      });

      return {
        type,
        url: response.data[0].url,
        prompt_used: prompt,
        revised_prompt: response.data[0].revised_prompt,
        generated_at: new Date().toISOString()
      };

    } catch (error) {
      console.error(`❌ ${type} generation failed:`, error);
      
      // Log specific OpenAI errors for debugging
      if (error.response) {
        console.error('OpenAI API Error:', error.response.status, error.response.data);
      }
      
      return null;
    }
  }

  /**
   * Utility functions
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  countImages(results) {
    return (results.thumbnail ? 1 : 0) + 
           results.characters.length + 
           results.locations.length + 
           results.evidence.length;
  }

  /**
   * Test OpenAI connection
   */
  async testConnection() {
    try {
      console.log('🧪 Testing OpenAI connection...');
      
      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: "Test image: simple blue circle on white background, minimalist design",
        size: "1024x1024",
        n: 1
      });
      
      console.log('✅ OpenAI connection successful');
      
      return {
        success: true,
        test_image_url: response.data[0].url,
        message: "DALL-E connection working correctly"
      };
    } catch (error) {
      console.error('❌ OpenAI connection failed:', error);
      
      return {
        success: false,
        error: error.message,
        message: "DALL-E connection failed - check API key and quota"
      };
    }
  }

  /**
   * Get service status and configuration
   */
  getStatus() {
    return {
      service: 'Tiger DALL-E Service',
      version: '2.0.0',
      model: this.config.model,
      quality: this.config.quality,
      image_size: this.config.size,
      api_key_configured: !!process.env.OPENAI_API_KEY,
      prompt_templates: Object.keys(this.prompts),
      max_images_per_episode: 7
    };
  }
}

// Export singleton instance
let dalleServiceInstance;

export function getDalleService() {
  if (!dalleServiceInstance) {
    dalleServiceInstance = new TigerDalleService();
  }
  return dalleServiceInstance;
}

export default TigerDalleService;