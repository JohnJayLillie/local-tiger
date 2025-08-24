// pages/api/generate-images.js - Enhanced True Crime API
import OpenAI from 'openai';

let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export default async function handler(req, res) {
  // CORS and method handling
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  const startTime = Date.now();
  console.log('🐅 Tiger True Crime generation started');

  try {
    const { story, imageCount = 6, platform = 'web' } = req.body;

    // Validation
    if (!story || story.trim().length < 10) {
      return res.status(400).json({ 
        success: false,
        message: 'Story must be at least 10 characters long' 
      });
    }

    console.log(`📝 Processing story: ${story.length} characters`);
    console.log(`🖼️ Generating ${imageCount} images for ${platform}`);

    // If no OpenAI API key, return enhanced mock data
    if (!openai) {
      console.log('⚠️ OpenAI not configured, using mock data');
      return generateEnhancedMockResponse(story, imageCount, platform);
    }

    // Generate scene descriptions for true crime documentary
    const scenePrompts = generateTrueCrimeScenes(story, imageCount);
    console.log('🎭 Scene prompts generated');

    // Generate images in parallel for optimal performance
    const imagePromises = scenePrompts.map(async (prompt, index) => {
      try {
        console.log(`🎨 Generating image ${index + 1}/${imageCount}`);
        
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: `Professional true crime documentary photograph: ${prompt}. Cinematic lighting, high detail, photorealistic, dramatic composition, documentary style.`,
          n: 1,
          size: "1024x1024",
          quality: "hd",
          style: "natural"
        });

        return {
          id: index + 1,
          url: response.data[0].url,
          prompt: prompt.substring(0, 120) + '...',
          scene: `Scene ${index + 1}`,
          type: 'real',
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        console.error(`❌ Image ${index + 1} generation failed:`, error.message);
        return {
          id: index + 1,
          url: generatePlaceholderUrl(index + 1),
          prompt: prompt.substring(0, 120) + '...',
          scene: `Scene ${index + 1}`,
          error: 'Generation failed',
          type: 'fallback',
          timestamp: new Date().toISOString()
        };
      }
    });

    const images = await Promise.all(imagePromises);
    const successCount = images.filter(img => !img.error).length;
    const processingTime = Date.now() - startTime;

    console.log(`✅ Generation complete: ${successCount}/${imageCount} images in ${processingTime}ms`);

    // Store results if database is configured
    if (process.env.SUPABASE_URL && successCount > 0) {
      await storeGenerationResults(story, images, platform);
    }

    res.status(200).json({
      success: true,
      images: images,
      metadata: {
        story: story.substring(0, 100) + '...',
        generatedAt: new Date().toISOString(),
        successRate: `${successCount}/${imageCount}`,
        processingTime: `${Math.round(processingTime / 1000)}s`,
        platform: platform,
        version: '1.0.0-production',
        apiStatus: openai ? 'real' : 'mock'
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('💥 Tiger generation error:', error);
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate images',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      metadata: {
        timestamp: new Date().toISOString(),
        processingTime: `${Math.round(processingTime / 1000)}s`,
        platform: req.body?.platform || 'unknown'
      }
    });
  }
}

function generateTrueCrimeScenes(story, count) {
  const baseScenes = [
    "Crime scene with police tape and forensic markers, dramatic evening lighting",
    "Detective examining evidence with magnifying glass, film noir style lighting", 
    "Courthouse steps with media crews and cameras, golden hour lighting",
    "Empty interrogation room with metal table and two chairs, stark lighting",
    "Evidence board with photos, documents, and red connecting strings",
    "Atmospheric shot of the crime location, moody overcast sky",
    "Close-up of crucial evidence on investigation table, focused lighting",
    "Courtroom interior with judge's bench and gallery, dramatic shadows",
    "Police station exterior at night with patrol cars, neon lighting",
    "Detective's desk covered with case files and coffee cup, desk lamp lighting"
  ];

  // Analyze story for context clues
  const storyLower = story.toLowerCase();
  const contextScenes = [];
  
  if (storyLower.includes('house') || storyLower.includes('home')) {
    contextScenes.push("Suburban house exterior with police investigation, dusk lighting");
  }
  if (storyLower.includes('car') || storyLower.includes('vehicle')) {
    contextScenes.push("Vehicle being examined by forensics team, spotlight illumination");
  }
  if (storyLower.includes('weapon') || storyLower.includes('gun')) {
    contextScenes.push("Evidence bag with weapon on laboratory table, clinical lighting");
  }
  
  const allScenes = [...baseScenes, ...contextScenes];
  return allScenes.slice(0, count);
}

function generateEnhancedMockResponse(story, imageCount, platform) {
  const mockImages = Array.from({ length: imageCount }, (_, index) => ({
    id: index + 1,
    url: `https://picsum.photos/400/300?random=${index + Date.now()}`,
    prompt: `Mock true crime scene ${index + 1} - professional documentary style`,
    scene: `Scene ${index + 1}`,
    type: 'mock',
    timestamp: new Date().toISOString()
  }));

  return Promise.resolve({
    success: true,
    images: mockImages,
    metadata: {
      story: story.substring(0, 100) + '...',
      generatedAt: new Date().toISOString(),
      successRate: `${imageCount}/${imageCount}`,
      processingTime: '2s',
      platform: platform,
      version: '1.0.0-mock',
      apiStatus: 'mock',
      note: 'Configure OPENAI_API_KEY for real AI generation'
    }
  });
}

function generatePlaceholderUrl(index) {
  const placeholders = [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop', // crime scene tape
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', // courthouse
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop', // office/investigation
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', // police cars
    'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=400&h=300&fit=crop', // evidence
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'  // documents
  ];
  return placeholders[index % placeholders.length] || placeholders[0];
}

async function storeGenerationResults(story, images, platform) {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const { data, error } = await supabase
      .from('tiger_generations')
      .insert([
        {
          story_text: story,
          images: images,
          platform: platform,
          created_at: new Date().toISOString(),
          success_count: images.filter(img => !img.error).length,
          total_count: images.length
        }
      ]);

    if (error) throw error;
    console.log('💾 Results stored in database');
  } catch (error) {
    console.error('🗄️ Database storage error:', error);
    // Don't fail the request if database storage fails
  }
}