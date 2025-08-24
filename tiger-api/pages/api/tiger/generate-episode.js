// api/tiger/generate-episode.js
export default function handler(req, res) {
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

  try {
    const { title, description } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ 
        error: 'Title and description are required' 
      });
    }

    // Generate episode ID
    const episodeId = `ep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // For now, just return success (we'll add real generation later)
    res.status(200).json({
      episodeId,
      message: 'Episode generation started',
      status: 'generating',
      estimatedTime: '3-4 minutes'
    });

  } catch (error) {
    console.error('Generate episode error:', error);
    res.status(500).json({ error: 'Generation failed' });
  }
}