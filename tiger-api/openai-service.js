// Tiger API - OpenAI Service
// Uses environment variables for secure API key management

const OpenAI = require('openai');

// Initialize OpenAI client with environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-key-here'
});

// Initialize Anthropic API key from environment
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'your-anthropic-key-here';

class OpenAIService {
  constructor() {
    this.client = openai;
  }

  async generateContent(prompt, options = {}) {
    try {
      const response = await this.client.chat.completions.create({
        model: options.model || 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: options.maxTokens || 2000,
        temperature: options.temperature || 0.7,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }
}

module.exports = OpenAIService;
