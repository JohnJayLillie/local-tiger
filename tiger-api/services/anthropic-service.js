// services/anthropic-service.js
const Anthropic = require('@anthropic-ai/sdk');

class AnthropicService {
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    
    this.models = {
      primary: 'claude-sonnet-4-20250514',
      advanced: 'claude-opus-4-20250514'
    };
  }

  /**
   * Helper function to parse Claude's JSON responses (handles markdown formatting)
   */
  parseClaudeJSON(responseText) {
    try {
      // Strip markdown formatting from Claude's response
      let cleanText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      return JSON.parse(cleanText);
    } catch (error) {
      throw new Error(`Failed to parse Claude JSON response: ${error.message}`);
    }
  }

  /**
   * Advanced script analysis with Claude's superior reasoning
   */
  async analyzeScriptAdvanced(script) {
    const prompt = `
      You are an expert in true crime content analysis. Analyze this script with forensic precision:

      Script: "${script}"

      Provide detailed analysis in JSON format:
      {
        "contentQuality": {
          "score": 0-100,
          "strengths": ["specific strengths"],
          "improvements": ["specific suggestions"],
          "factualAccuracy": "assessment",
          "narrativeFlow": "assessment"
        },
        "visualRequirements": {
          "keyScenes": ["scene descriptions for image generation"],
          "characterProfiles": [
            {
              "name": "Full name",
              "role": "victim/suspect/detective/witness/family",
              "description": "Physical description and context",
              "emotionalContext": "Relevant emotional state",
              "timeframe": "When they appear in story",
              "significance": "Why they're important"
            }
          ],
          "locations": [
            {
              "name": "Location name",
              "type": "crime scene/residence/workplace/public",
              "description": "Visual description",
              "atmosphere": "Mood and tone needed",
              "significance": "Role in the story"
            }
          ]
        },
        "contentOptimization": {
          "targetAudience": "Primary audience",
          "engagementHooks": ["Specific hooks to maintain interest"],
          "pacing": "Assessment of story pacing",
          "suspenseElements": ["Elements that create suspense"],
          "informationBalance": "Balance of facts vs narrative"
        },
        "complianceCheck": {
          "sensitivityLevel": "low/medium/high",
          "potentialIssues": ["Any compliance concerns"],
          "ageAppropriate": true/false,
          "factualVerifiable": true/false,
          "respectfulTreatment": "Assessment of victim/family treatment"
        }
      }

      Focus on creating compelling, respectful true crime content that honors victims while engaging audiences.
    `;

    try {
      const response = await this.anthropic.messages.create({
        model: this.models.primary,
        max_tokens: 2000,
        temperature: 0.3,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      return this.parseClaudeJSON(response.content[0].text);
    } catch (error) {
      throw new Error(`Advanced script analysis failed: ${error.message}`);
    }
  }

  /**
   * Generate optimized DALL-E prompts using Claude's creative abilities
   */
  async optimizeImagePrompts(characterProfiles, locations) {
    const prompt = `
      Create optimized DALL-E prompts for true crime documentary imagery.
      
      Characters: ${JSON.stringify(characterProfiles)}
      Locations: ${JSON.stringify(locations)}
      
      Generate prompts that:
      1. Create professional, documentary-quality images
      2. Respect the subjects and avoid sensationalism
      3. Match the "Binge True Crime" polaroid aesthetic
      4. Include appropriate historical context
      5. Ensure legal and ethical compliance
      
      Return JSON:
      {
        "characterPrompts": [
          {
            "character": "Character name",
            "prompt": "Detailed DALL-E prompt",
            "style": "documentary/professional/historical",
            "mood": "appropriate emotional tone"
          }
        ],
        "locationPrompts": [
          {
            "location": "Location name", 
            "prompt": "Detailed DALL-E prompt",
            "atmosphere": "environmental mood",
            "timeOfDay": "optimal lighting"
          }
        ],
        "compositionTips": [
          "Specific guidance for polaroid layouts"
        ]
      }
    `;

    try {
      const response = await this.anthropic.messages.create({
        model: this.models.primary,
        max_tokens: 1500,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      return this.parseClaudeJSON(response.content[0].text);
    } catch (error) {
      throw new Error(`Image prompt optimization failed: ${error.message}`);
    }
  }

  /**
   * Content compliance and sensitivity analysis
   */
  async analyzeCompliance(script, imageDescriptions) {
    const prompt = `
      Conduct a thorough compliance analysis for this true crime content:
      
      Script: "${script}"
      Image Descriptions: ${JSON.stringify(imageDescriptions)}
      
      Analyze for:
      1. Legal compliance (defamation, privacy rights)
      2. Platform guidelines (YouTube, TikTok, Instagram)
      3. Ethical considerations (victim dignity, family impact)
      4. Age appropriateness
      5. Factual accuracy requirements
      
      Return detailed assessment:
      {
        "overallCompliance": "pass/warning/fail",
        "legalAssessment": {
          "defamationRisk": "low/medium/high",
          "privacyRisk": "low/medium/high", 
          "recommendations": ["specific legal recommendations"]
        },
        "platformCompliance": {
          "youtube": "compliant/warning/violation",
          "tiktok": "compliant/warning/violation",
          "instagram": "compliant/warning/violation",
          "issues": ["specific platform issues"]
        },
        "ethicalConsiderations": {
          "victimRespect": "assessment",
          "familyImpact": "assessment",
          "sensationalism": "low/medium/high",
          "recommendations": ["ethical improvements"]
        },
        "requiredChanges": ["specific changes needed"],
        "alternativeApproaches": ["if major issues exist"]
      }
    `;

    try {
      const response = await this.anthropic.messages.create({
        model: this.models.advanced, // Use Opus for complex analysis
        max_tokens: 2000,
        temperature: 0.1,
        messages: [
          {
            role: 'user', 
            content: prompt
          }
        ]
      });

      return this.parseClaudeJSON(response.content[0].text);
    } catch (error) {
      throw new Error(`Compliance analysis failed: ${error.message}`);
    }
  }

  /**
   * Generate video script optimization suggestions
   */
  async optimizeVideoScript(script, targetLength, platform) {
    const prompt = `
      Optimize this true crime script for ${platform} video content:
      
      Original Script: "${script}"
      Target Length: ${targetLength} seconds
      Platform: ${platform}
      
      Provide optimization:
      {
        "optimizedScript": "Rewritten script optimized for video",
        "timing": {
          "totalSeconds": ${targetLength},
          "segments": [
            {
              "timeStart": 0,
              "timeEnd": 30, 
              "content": "Segment content",
              "visualCue": "What should be shown",
              "voiceDirection": "Tone and pacing notes"
            }
          ]
        },
        "platformOptimization": {
          "hookTiming": "When to place the strongest hook",
          "pacing": "Optimal pacing for platform",
          "visualChanges": "Recommended visual change frequency",
          "callToAction": "Platform-specific CTA suggestions"
        },
        "engagementTactics": [
          "Specific tactics to maintain viewer attention"
        ]
      }
    `;

    try {
      const response = await this.anthropic.messages.create({
        model: this.models.primary,
        max_tokens: 1800,
        temperature: 0.4,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      return this.parseClaudeJSON(response.content[0].text);
    } catch (error) {
      throw new Error(`Video script optimization failed: ${error.message}`);
    }
  }

  /**
   * Compare analysis with OpenAI GPT-4 results
   */
  async compareWithGPT(claudeAnalysis, gptAnalysis) {
    const prompt = `
      Compare these two AI analyses of the same true crime content:
      
      Claude Analysis: ${JSON.stringify(claudeAnalysis)}
      GPT-4 Analysis: ${JSON.stringify(gptAnalysis)}
      
      Provide synthesis:
      {
        "bestElements": {
          "fromClaude": ["specific superior elements"],
          "fromGPT": ["specific superior elements"]
        },
        "discrepancies": [
          {
            "aspect": "Where they disagree",
            "claudeView": "Claude's perspective",
            "gptView": "GPT's perspective", 
            "recommendation": "Which to follow and why"
          }
        ],
        "synthesizedRecommendation": {
          "finalScript": "Best version combining both analyses",
          "visualDirection": "Optimal visual approach",
          "qualityScore": "0-100 final score"
        },
        "confidenceLevel": "How confident in final recommendation"
      }
    `;

    try {
      const response = await this.anthropic.messages.create({
        model: this.models.primary,
        max_tokens: 1500,
        temperature: 0.2,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      return this.parseClaudeJSON(response.content[0].text);
    } catch (error) {
      throw new Error(`AI comparison analysis failed: ${error.message}`);
    }
  }

  /**
   * Generate content series planning
   */
  async planContentSeries(initialScript, seriesGoals) {
    const prompt = `
      Plan a content series based on this initial true crime script:
      
      Initial Script: "${initialScript}"
      Series Goals: ${JSON.stringify(seriesGoals)}
      
      Create series plan:
      {
        "seriesOverview": {
          "theme": "Overarching series theme",
          "episodeCount": "Recommended number",
          "releaseSchedule": "Optimal posting frequency",
          "audience": "Target audience profile"
        },
        "episodes": [
          {
            "episodeNumber": 1,
            "title": "Episode title",
            "focusAspect": "What this episode emphasizes",
            "duration": "Recommended length",
            "keyVisuals": ["Main visual elements needed"],
            "cliffhanger": "How to connect to next episode"
          }
        ],
        "brandingConsistency": {
          "visualStyle": "Consistent visual elements",
          "narrativeVoice": "Consistent tone and approach",
          "seriesIdentifiers": "What makes it recognizable"
        },
        "growthStrategy": {
          "seoKeywords": ["Relevant keywords for discovery"],
          "crossPromotion": ["How episodes promote each other"],
          "communityBuilding": ["Audience engagement tactics"]
        }
      }
    `;

    try {
      const response = await this.anthropic.messages.create({
        model: this.models.primary,
        max_tokens: 2000,
        temperature: 0.6,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      return this.parseClaudeJSON(response.content[0].text);
    } catch (error) {
      throw new Error(`Content series planning failed: ${error.message}`);
    }
  }
}

module.exports = AnthropicService;