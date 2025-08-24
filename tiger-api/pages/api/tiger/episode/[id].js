// api/tiger/episode/[id].js
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    // Mock episode data for testing
    res.status(200).json({
      id,
      title: 'The Missing Heiress of Blackwood Manor',
      status: 'completed',
      description: 'Isabella Blackwood, 28-year-old heiress to the Blackwood shipping fortune, vanished from her Charleston mansion...',
      year: '2019',
      location: 'Charleston, South Carolina',
      case_type: 'missing_person',
      key_people: [
        'Isabella Blackwood - Missing heiress, 28, blonde hair, blue eyes',
        'Margaret Blackwood - Stepmother, 45, business manager, potential suspect',
        'Detective Sarah Chen - Lead investigator, Charleston PD',
        'Marcus Brennan - Isabella\'s ex-fiancé, last person to see her'
      ],
      images: [
        { name: 'YouTube Thumbnail', type: 'thumbnail', url: '#' },
        { name: 'Master Background', type: 'background', url: '#' },
        { name: 'Character Portrait 1', type: 'portrait', url: '#' },
        { name: 'Character Portrait 2', type: 'portrait', url: '#' },
        { name: 'Character Portrait 3', type: 'portrait', url: '#' },
        { name: 'Character Portrait 4', type: 'portrait', url: '#' }
      ],
      created_at: new Date().toISOString(),
      completed_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get episode error:', error);
    res.status(500).json({ error: 'Failed to get episode' });
  }
}