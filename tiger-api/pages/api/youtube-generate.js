const { generateYouTubeContent } = require('../../services/openai-service');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, options = {} } = req.body;

  if (!prompt || prompt.length < 10) {
    return res.status(400).json({ error: 'Prompt must be at least 10 characters' });
  }

  try {
    const startTime = Date.now();
    
    const result = await generateYouTubeContent(prompt, options);
    
    const generationTime = Date.now() - startTime;
    
    res.status(200).json({
      success: true,
      data: result,
      generationTimeMs: generationTime,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('YouTube generation API error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
