const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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

  const { messages, maxTokens = 2000 } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      max_tokens: maxTokens,
      temperature: 0.7
    });

    res.status(200).json({
      success: true,
      content: response.choices[0].message.content,
      usage: response.usage
    });

  } catch (error) {
    console.error('OpenAI Chat API error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
