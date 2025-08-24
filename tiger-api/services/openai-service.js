const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// YouTube content generation
async function generateYouTubeContent(prompt, options = {}) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a YouTube content optimization expert. Generate engaging titles, descriptions, and strategies that maximize views and engagement.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: options.maxTokens || 2000,
      temperature: options.temperature || 0.7
    });

    return {
      content: response.choices[0].message.content,
      usage: response.usage,
      model: 'gpt-4'
    };
  } catch (error) {
    console.error('OpenAI YouTube generation error:', error);
    throw new Error(`Content generation failed: ${error.message}`);
  }
}

// True Crime image generation
async function generateTrueCrimeImages(story, options = {}) {
  try {
    const imagePrompt = `Documentary-style true crime scene: ${story}. Professional, realistic, cinematic lighting, high-quality photography style.`;
    
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: imagePrompt,
      n: options.imageCount || 1,
      size: options.size || '1024x1024',
      quality: 'hd',
      style: 'natural'
    });

    return {
      images: response.data,
      prompt: imagePrompt,
      model: 'dall-e-3'
    };
  } catch (error) {
    console.error('DALL-E image generation error:', error);
    throw new Error(`Image generation failed: ${error.message}`);
  }
}

module.exports = {
  generateYouTubeContent,
  generateTrueCrimeImages
};
