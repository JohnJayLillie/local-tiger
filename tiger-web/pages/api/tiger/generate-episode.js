// tiger-web/pages/api/tiger/generate-episode.js
// Main episode generation endpoint with real DALL-E integration

import { getDalleService } from '../services/dalle-service.js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
      allowed_methods: ['POST']
    });
  }

  try {
    const { title, description, characters, locations, evidence, time_period } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: 'Title and description are required',
        received: { title: !!title, description: !!description }
      });
    }

    // Validate input lengths
    if (title.length < 3 || title.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Title must be between 3 and 100 characters'
      });
    }

    if (description.length < 10 || description.length > 500) {
      return res.status(400).json({
        success: false,
        error: 'Description must be between 10 and 500 characters'
      });
    }

    console.log(`🐅 Starting Tiger episode generation: ${title}`);

    // Prepare episode data for AI generation
    const episodeData = {
      title: title.trim(),
      description: description.trim(),
      characters: characters || [],
      locations: locations || [],
      evidence: evidence || [],
      time_period: time_period || '1990s'
    };

    // Additional validation
    const validation = validateEpisodeData(episodeData);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    console.log(`📋 Episode data validated for: ${episodeData.title}`);
    console.log(`👥 Characters: ${episodeData.characters.length}`);
    console.log(`📍 Locations: ${episodeData.locations.length}`);
    console.log(`🕐 Time period: ${episodeData.time_period}`);

    // Get DALL-E service instance
    const dalleService = getDalleService();

    // Test connection first (optional, remove in production for speed)
    const connectionTest = await dalleService.testConnection();
    if (!connectionTest.success) {
      return res.status(503).json({
        success: false,
        error: 'AI service unavailable',
        details: connectionTest.error,
        retry_suggested: true
      });
    }

    // Generate images using real DALL-E
    console.log('🎨 Starting DALL-E image generation...');
    const generationResult = await dalleService.generateEpisodeImages(episodeData);

    if (!generationResult.success) {
      console.error('❌ Image generation failed:', generationResult.error);
      return res.status(500).json({
        success: false,
        error: 'Image generation failed',
        details: generationResult.error,
        retry_suggested: true
      });
    }

    // Create episode response with real generated images
    const episode = {
      id: generateEpisodeId(),
      title: episodeData.title,
      description: episodeData.description,
      status: 'completed',
      created_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      generation_time: generationResult.generation_time,
      
      // Real generated images from DALL-E
      images: generationResult.images,
      
      // Input data for reference
      input_data: {
        characters: episodeData.characters,
        locations: episodeData.locations,
        evidence: episodeData.evidence,
        time_period: episodeData.time_period
      },
      
      // Metadata
      metadata: {
        characters_count: episodeData.characters.length,
        locations_count: episodeData.locations.length,
        evidence_count: episodeData.evidence.length,
        total_images_generated: generationResult.images.metadata.total_images,
        ai_service: 'OpenAI DALL-E-3',
        generation_method: 'real_ai',
        quality: 'HD',
        image_size: '1024x1024'
      }
    };

    console.log(`✅ Episode "${episode.title}" generated successfully!`);
    console.log(`📊 Generated ${episode.metadata.total_images_generated} images in ${episode.generation_time}`);

    // Return successful response with real generated content
    res.status(200).json({
      success: true,
      episode: episode,
      message: `Successfully generated ${episode.metadata.total_images_generated} professional images for "${episode.title}"`,
      api_info: {
        endpoint: '/api/tiger/generate-episode',
        method: 'POST',
        version: '2.0.0'
      }
    });

  } catch (error) {
    console.error('🚨 Episode generation error:', error);
    
    // Check if it's an OpenAI API error
    if (error.message?.includes('OpenAI') || error.message?.includes('API key')) {
      return res.status(503).json({
        success: false,
        error: 'AI service configuration error',
        details: 'Please check OpenAI API key and billing status',
        retry_suggested: false
      });
    }

    // Check for timeout errors
    if (error.message?.includes('timeout') || error.code === 'ETIMEDOUT') {
      return res.status(408).json({
        success: false,
        error: 'Request timeout',
        details: 'Image generation took too long. Please try again.',
        retry_suggested: true
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      error: 'Internal server error during episode generation',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
      retry_suggested: true
    });
  }
}

/**
 * Validate episode data structure and content
 */
function validateEpisodeData(episodeData) {
  // Check required fields
  if (!episodeData.title || episodeData.title.length < 3) {
    return { valid: false, error: 'Title must be at least 3 characters long' };
  }

  if (!episodeData.description || episodeData.description.length < 10) {
    return { valid: false, error: 'Description must be at least 10 characters long' };
  }

  // Validate characters array
  if (episodeData.characters && episodeData.characters.length > 0) {
    for (let i = 0; i < episodeData.characters.length; i++) {
      const character = episodeData.characters[i];
      if (!character.name || !character.name.trim()) {
        return { valid: false, error: `Character ${i + 1} must have a name` };
      }
      if (character.name.length > 50) {
        return { valid: false, error: `Character ${i + 1} name too long (max 50 characters)` };
      }
    }
    
    if (episodeData.characters.length > 4) {
      return { valid: false, error: 'Maximum 4 characters allowed per episode' };
    }
  }

  // Validate locations array
  if (episodeData.locations && episodeData.locations.length > 0) {
    for (let i = 0; i < episodeData.locations.length; i++) {
      const location = episodeData.locations[i];
      if (!location.name || !location.name.trim()) {
        return { valid: false, error: `Location ${i + 1} must have a name` };
      }
      if (location.name.length > 50) {
        return { valid: false, error: `Location ${i + 1} name too long (max 50 characters)` };
      }
    }
    
    if (episodeData.locations.length > 3) {
      return { valid: false, error: 'Maximum 3 locations allowed per episode' };
    }
  }

  // Validate time period
  const validTimePeriods = ['1980s', '1990s', '2000s', '2010s', '2020s'];
  if (episodeData.time_period && !validTimePeriods.includes(episodeData.time_period)) {
    return { valid: false, error: 'Invalid time period. Must be one of: ' + validTimePeriods.join(', ') };
  }

  return { valid: true };
}

/**
 * Generate unique episode ID
 */
function generateEpisodeId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `ep_${timestamp}_${randomStr}`;
}

/**
 * API route configuration for Vercel
 */
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: '8mb', // Allow larger responses for multiple images
  },
  maxDuration: 300, // 5 minutes timeout for image generation
};