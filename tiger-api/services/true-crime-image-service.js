// services/true-crime-image-service.js
const OpenAI = require('openai');

class TrueCrimeImageService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    // True crime visual specifications
    this.polaroidSpecs = {
      aspectRatio: "1:1",
      borderWidth: "20px",
      borderColor: "#FFFFFF",
      textColor: "#8B4513", // Brown color matching Binge True Crime
      font: "Arial, sans-serif",
      fontSize: "18px",
      fontWeight: "bold"
    };
    
    this.imageSpecs = {
      resolution: "1024x1024",
      quality: "hd",
      style: "natural"
    };
  }

  /**
   * Analyze script and extract true crime segments
   */
  async analyzeScript(script) {
    try {
      const prompt = `
        Analyze this true crime script and extract structured data for image generation.
        
        Script: "${script}"
        
        Extract:
        1. Episode title (catchy, under 60 characters)
        2. Primary location/setting for master background
        3. Individual segments with subjects
        
        Return JSON format:
        {
          "episodeTitle": "Title for YouTube thumbnail",
          "masterLocation": "Primary crime scene or location",
          "timeframe": "Time period (year/decade)",
          "segments": [
            {
              "subjectName": "Full name",
              "role": "victim/suspect/detective/witness",
              "description": "Brief description for image generation",
              "ageRange": "approximate age",
              "gender": "male/female"
            }
          ]
        }
        
        Focus on people mentioned in the script. Avoid graphic violence descriptions.
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1000
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      throw new Error(`Script analysis failed: ${error.message}`);
    }
  }

  /**
   * Generate master background image (reused across segments)
   */
  async generateMasterBackground(location, timeframe) {
    const prompt = `
      Create a documentary-style photograph of ${location} from ${timeframe}.
      
      Style: Professional crime documentary, neutral lighting, slightly desaturated colors.
      Content: Establishing shot of the location, no people visible, atmospheric.
      Mood: Serious, investigative, historical accuracy.
      Quality: High resolution, suitable for text overlays.
      
      Avoid: Graphic content, overly dramatic lighting, modern elements if historical.
    `;

    try {
      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: this.imageSpecs.resolution,
        quality: this.imageSpecs.quality,
        style: this.imageSpecs.style
      });

      return {
        url: response.data[0].url,
        type: 'master_background',
        location: location,
        timeframe: timeframe
      };
    } catch (error) {
      throw new Error(`Master background generation failed: ${error.message}`);
    }
  }

  /**
   * Generate subject portrait for polaroid layout
   */
  async generateSubjectPortrait(subject) {
    const prompt = `
      Create a professional documentary-style portrait photograph of ${subject.subjectName}.
      
      Subject: ${subject.ageRange} year old ${subject.gender} ${subject.role}
      Description: ${subject.description}
      
      Style: Police file photo or professional headshot style
      Lighting: Even, professional lighting
      Background: Neutral gray or white background
      Expression: Neutral, serious, appropriate for documentary
      Quality: High resolution, clear facial features
      
      Format: Head and shoulders portrait, facing camera
      Avoid: Graphic content, exaggerated features, modern clothing if historical
    `;

    try {
      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: this.imageSpecs.resolution,
        quality: this.imageSpecs.quality,
        style: this.imageSpecs.style
      });

      return {
        url: response.data[0].url,
        type: 'subject_portrait',
        subject: subject.subjectName,
        role: subject.role
      };
    } catch (error) {
      throw new Error(`Subject portrait generation failed for ${subject.subjectName}: ${error.message}`);
    }
  }

  /**
   * Generate YouTube thumbnail for episode
   */
  async generateYouTubeThumbnail(episodeTitle, masterBackground) {
    const prompt = `
      Create a YouTube thumbnail for true crime episode: "${episodeTitle}"
      
      Style: Professional documentary thumbnail
      Layout: Text overlay on crime scene background
      Colors: Dark, serious tones with readable text
      Text: Large, bold title text
      Quality: Eye-catching but tasteful, no clickbait elements
      
      Background reference: Crime scene or location setting
      Mood: Mysterious, investigative, professional
    `;

    try {
      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1792x1024", // YouTube thumbnail ratio
        quality: this.imageSpecs.quality,
        style: this.imageSpecs.style
      });

      return {
        url: response.data[0].url,
        type: 'youtube_thumbnail',
        title: episodeTitle
      };
    } catch (error) {
      throw new Error(`YouTube thumbnail generation failed: ${error.message}`);
    }
  }

  /**
   * Generate complete episode image set
   */
  async generateEpisodeImageSet(script) {
    try {
      console.log('🔍 Analyzing script for true crime content...');
      const analysis = await this.analyzeScript(script);
      
      console.log('🎬 Generating master background...');
      const masterBackground = await this.generateMasterBackground(
        analysis.masterLocation, 
        analysis.timeframe
      );
      
      console.log('🖼️ Generating YouTube thumbnail...');
      const thumbnail = await this.generateYouTubeThumbnail(
        analysis.episodeTitle, 
        masterBackground
      );
      
      console.log('👥 Generating subject portraits...');
      const portraits = [];
      for (const segment of analysis.segments) {
        const portrait = await this.generateSubjectPortrait(segment);
        portraits.push(portrait);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      return {
        analysis,
        masterBackground,
        thumbnail,
        portraits,
        metadata: {
          totalImages: 2 + portraits.length,
          generationTime: new Date().toISOString(),
          format: 'true_crime_polaroid_set'
        }
      };
    } catch (error) {
      throw new Error(`Episode image set generation failed: ${error.message}`);
    }
  }

  /**
   * Create polaroid-style dual image layout (for future implementation)
   */
  async createPolaroidLayout(leftImage, rightImage, leftText, rightText) {
    // This would integrate with image composition service
    // For now, return the structure for frontend composition
    return {
      layout: 'dual_polaroid',
      leftPolaroid: {
        image: leftImage,
        text: leftText,
        position: 'left',
        style: this.polaroidSpecs
      },
      rightPolaroid: {
        image: rightImage,
        text: rightText,
        position: 'right',
        style: this.polaroidSpecs
      }
    };
  }

  /**
   * Optimize images for different platforms
   */
  async optimizeForPlatform(imageSet, platform) {
    const platformSpecs = {
      youtube: { width: 1280, height: 720, ratio: '16:9' },
      tiktok: { width: 1080, height: 1920, ratio: '9:16' },
      instagram: { width: 1080, height: 1080, ratio: '1:1' }
    };
    
    const spec = platformSpecs[platform.toLowerCase()];
    if (!spec) {
      throw new Error(`Unsupported platform: ${platform}`);
    }
    
    // Return optimization parameters for image processing
    return {
      platform,
      specifications: spec,
      imageSet: imageSet,
      optimizationRequired: true
    };
  }
}

module.exports = TrueCrimeImageService;