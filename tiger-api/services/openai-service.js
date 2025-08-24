// services/openai-service.js - OpenAI Integration for Tiger
const OpenAI = require('openai');

class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  // Analyze and optimize scripts for video content
  async analyzeScript(script, platform = 'youtube') {
    try {
      const prompt = this.buildScriptAnalysisPrompt(script, platform);
      
      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const analysis = JSON.parse(response.choices[0].message.content);
      return {
        success: true,
        analysis,
        originalScript: script,
        platform,
        optimizationScore: analysis.score
      };
    } catch (error) {
      console.error('OpenAI script analysis error:', error);
      return {
        success: false,
        error: error.message,
        analysis: null
      };
    }
  }

  // Generate optimized prompts using frameworks
  async optimizePrompt(userPrompt, framework = 'RACE') {
    try {
      const systemPrompt = this.buildPromptOptimizationPrompt(framework);
      
      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 800,
        temperature: 0.8,
      });

      const optimization = JSON.parse(response.choices[0].message.content);
      return {
        success: true,
        originalPrompt: userPrompt,
        optimizedPrompt: optimization.optimized_prompt,
        framework,
        qualityScore: optimization.quality_score,
        improvements: optimization.improvements,
        reasoning: optimization.reasoning
      };
    } catch (error) {
      console.error('OpenAI prompt optimization error:', error);
      return {
        success: false,
        error: error.message,
        optimizedPrompt: userPrompt // Fallback to original
      };
    }
  }

  // Generate DALL-E images for video thumbnails
  async generateThumbnail(description, platform = 'youtube') {
    try {
      const dimensions = this.getThumbnailDimensions(platform);
      const enhancedPrompt = this.buildThumbnailPrompt(description, platform);

      const response = await this.client.images.generate({
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        size: dimensions,
        quality: 'hd',
        n: 1,
      });

      return {
        success: true,
        imageUrl: response.data[0].url,
        platform,
        dimensions,
        prompt: enhancedPrompt
      };
    } catch (error) {
      console.error('DALL-E thumbnail generation error:', error);
      return {
        success: false,
        error: error.message,
        imageUrl: null
      };
    }
  }

  // Real-time content quality scoring
  async scoreContent(content, contentType = 'script') {
    try {
      const prompt = this.buildContentScoringPrompt(content, contentType);
      
      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 400,
        temperature: 0.3,
      });

      const scoring = JSON.parse(response.choices[0].message.content);
      return {
        success: true,
        content,
        contentType,
        overallScore: scoring.overall_score,
        metrics: scoring.metrics,
        suggestions: scoring.suggestions,
        strengths: scoring.strengths
      };
    } catch (error) {
      console.error('Content scoring error:', error);
      return {
        success: false,
        error: error.message,
        overallScore: 0
      };
    }
  }

  // Helper Methods
  buildScriptAnalysisPrompt(script, platform) {
    return `Analyze this video script for ${platform} and provide optimization suggestions.

Script: "${script}"

Analyze for:
1. Hook effectiveness (first 3-5 seconds)
2. Content structure and flow
3. Platform-specific optimization
4. Engagement potential
5. Call-to-action strength

Respond with valid JSON in this format:
{
  "score": 85,
  "hook_strength": 9,
  "structure_score": 8,
  "platform_optimization": 7,
  "engagement_potential": 9,
  "cta_effectiveness": 8,
  "suggestions": [
    "Strengthen opening hook",
    "Add platform-specific elements"
  ],
  "optimized_script": "Improved version here...",
  "estimated_performance": "high/medium/low"
}`;
  }

  buildPromptOptimizationPrompt(framework) {
    const frameworks = {
      RACE: 'Role, Action, Context, Example - Structure prompts with clear role definition, specific action, relevant context, and concrete examples',
      SCOPE: 'Subject, Context, Objective, Persona, Example - Define subject matter, provide context, state clear objectives, specify persona, include examples',
      VIRAL: 'Value, Interest, Relevance, Action, Logic - Ensure value proposition, maintain interest, relevance to audience, clear action items, logical flow',
      EDUCATE: 'Explain, Demonstrate, Understand, Clarify, Apply, Test, Evaluate - Educational framework for learning-focused content'
    };

    return `You are an expert prompt engineer. Optimize user prompts using the ${framework} framework.

${framework} Framework: ${frameworks[framework]}

Rules:
1. Analyze the user's prompt for clarity and effectiveness
2. Apply the ${framework} framework to improve it
3. Provide quality score (0-100)
4. Explain specific improvements made

Respond with valid JSON:
{
  "quality_score": 85,
  "optimized_prompt": "Improved prompt here...",
  "improvements": ["Added clear role definition", "Enhanced context"],
  "reasoning": "Explanation of changes...",
  "framework_application": "How ${framework} was applied..."
}`;
  }

  buildThumbnailPrompt(description, platform) {
    const platformSpecs = {
      youtube: 'YouTube thumbnail style: bold text, vibrant colors, high contrast, eye-catching design',
      tiktok: 'TikTok style: vertical format, trendy aesthetics, bold fonts, youth-oriented design',
      instagram: 'Instagram style: clean aesthetic, balanced composition, brand-friendly colors'
    };

    return `Create a compelling video thumbnail: ${description}. 
Style: ${platformSpecs[platform] || platformSpecs.youtube}. 
Make it click-worthy, professional, and platform-optimized.`;
  }

  buildContentScoringPrompt(content, contentType) {
    return `Score this ${contentType} content for quality and effectiveness (0-100 scale):

Content: "${content}"

Evaluate:
1. Clarity and coherence
2. Engagement potential  
3. Value proposition
4. Call-to-action effectiveness
5. Platform suitability

Respond with valid JSON:
{
  "overall_score": 85,
  "metrics": {
    "clarity": 90,
    "engagement": 80,
    "value": 85,
    "cta": 75,
    "platform_fit": 90
  },
  "suggestions": ["Improve call-to-action", "Add more specific examples"],
  "strengths": ["Clear messaging", "Good hook"]
}`;
  }

  getThumbnailDimensions(platform) {
    const dimensions = {
      youtube: '1792x1024', // 16:9 ratio
      tiktok: '1024x1792',  // 9:16 ratio  
      instagram: '1024x1024' // 1:1 ratio
    };
    return dimensions[platform] || dimensions.youtube;
  }
}

module.exports = OpenAIService;