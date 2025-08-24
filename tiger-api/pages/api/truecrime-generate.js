const { generateTrueCrimeImages } = require('../../services/openai-service');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { story, options = {} } = req.body;

  if (!story || story.length < 10) {
    return res.status(400).json({ error: 'Story must be at least 10 characters' });
  }

  try {
    const startTime = Date.now();
    
    const result = await generateTrueCrimeImages(story, options);
    
    const generationTime = Date.now() - startTime;
    
    res.status(200).json({
      success: true,
      data: result,
      generationTimeMs: generationTime,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('True Crime generation API error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}