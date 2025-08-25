// tiger-api/src/controllers/ScriptController.js - Script Generation and Audio Reading Logic
import { OpenAIService } from '../services/ai/OpenAIService.js';
import { AnthropicService } from '../services/ai/AnthropicService.js';
import { ScriptGenerator } from '../services/script/ScriptGenerator.js';
import { AudioProcessor } from '../services/script/AudioProcessor.js';
import { logger } from '../utils/logger.js';

export class ScriptController {
  
  /**
   * Generate a script from content input
   * NEW FEATURE: Generate, display and save a script for audio reading
   */
  static async generateScript(req, res) {
    try {
      const { content, platform, tone, voiceType = 'professional', pacing = 'medium' } = req.body;
      const userId = req.user.id;

      logger.info(`Generating script for user ${userId}`);

      // Generate base script using AI
      const baseScript = await ScriptGenerator.generateFromContent({
        content,
        platform,
        tone,
        userId
      });

      // Optimize for audio reading
      const audioOptimizedScript = await AudioProcessor.optimizeForAudio({
        script: baseScript.content,
        voiceType,
        pacing,
        platform
      });

      // Save script to database
      const savedScript = await ScriptGenerator.saveScript({
        userId,
        title: baseScript.title,
        content: audioOptimizedScript.content,
        originalContent: content,
        platform,
        tone,
        voiceType,
        pacing,
        metadata: {
          wordCount: audioOptimizedScript.wordCount,
          estimatedDuration: audioOptimizedScript.estimatedDuration,
          readingLevel: audioOptimizedScript.readingLevel
        }
      });

      res.json({
        success: true,
        data: {
          scriptId: savedScript.id,
          title: savedScript.title,
          content: audioOptimizedScript.content,
          audioMetadata: {
            wordCount: audioOptimizedScript.wordCount,
            estimatedDuration: audioOptimizedScript.estimatedDuration,
            pacing: audioOptimizedScript.pacing,
            voiceType: audioOptimizedScript.voiceType
          },
          createdAt: savedScript.createdAt
        }
      });

    } catch (error) {
      logger.error('Error generating script:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate script'
      });
    }
  }

  /**
   * Get all user scripts
   */
  static async getUserScripts(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20, platform, sortBy = 'createdAt' } = req.query;

      const scripts = await ScriptGenerator.getUserScripts({
        userId,
        page: parseInt(page),
        limit: parseInt(limit),
        platform,
        sortBy
      });

      res.json({
        success: true,
        data: scripts
      });

    } catch (error) {
      logger.error('Error fetching user scripts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch scripts'
      });
    }
  }

  /**
   * Get specific script by ID
   */
  static async getScript(req, res) {
    try {
      const { scriptId } = req.params;
      const userId = req.user.id;

      const script = await ScriptGenerator.getScript(scriptId, userId);

      if (!script) {
        return res.status(404).json({
          success: false,
          error: 'Script not found'
        });
      }

      res.json({
        success: true,
        data: script
      });

    } catch (error) {
      logger.error('Error fetching script:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch script'
      });
    }
  }

  /**
   * Save/Update script
   * NEW FEATURE: Save scripts for audio reading
   */
  static async saveScript(req, res) {
    try {
      const { scriptId } = req.params;
      const { title, content, voiceType, pacing } = req.body;
      const userId = req.user.id;

      // Re-optimize for audio if voice settings changed
      let audioOptimizedContent = content;
      if (voiceType || pacing) {
        const optimized = await AudioProcessor.optimizeForAudio({
          script: content,
          voiceType: voiceType || 'professional',
          pacing: pacing || 'medium'
        });
        audioOptimizedContent = optimized.content;
      }

      const updatedScript = await ScriptGenerator.updateScript({
        scriptId,
        userId,
        title,
        content: audioOptimizedContent,
        voiceType,
        pacing
      });

      res.json({
        success: true,
        data: updatedScript
      });

    } catch (error) {
      logger.error('Error saving script:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to save script'
      });
    }
  }

  /**
   * Delete script
   */
  static async deleteScript(req, res) {
    try {
      const { scriptId } = req.params;
      const userId = req.user.id;

      await ScriptGenerator.deleteScript(scriptId, userId);

      res.json({
        success: true,
        message: 'Script deleted successfully'
      });

    } catch (error) {
      logger.error('Error deleting script:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete script'
      });
    }
  }

  /**
   * Generate audio-optimized script
   * NEW FEATURE: Format script specifically for audio reading
   */
  static async generateAudioScript(req, res) {
    try {
      const { scriptId, voiceType = 'professional', pacing = 'medium' } = req.body;
      const userId = req.user.id;

      // Get original script
      const script = await ScriptGenerator.getScript(scriptId, userId);
      if (!script) {
        return res.status(404).json({
          success: false,
          error: 'Script not found'
        });
      }

      // Generate audio-optimized version
      const audioScript = await AudioProcessor.optimizeForAudio({
        script: script.content,
        voiceType,
        pacing,
        platform: script.platform
      });

      // Save audio version
      const audioVersion = await ScriptGenerator.createAudioVersion({
        originalScriptId: scriptId,
        content: audioScript.content,
        voiceType,
        pacing,
        metadata: audioScript
      });

      res.json({
        success: true,
        data: {
          audioScriptId: audioVersion.id,
          content: audioScript.content,
          metadata: {
            wordCount: audioScript.wordCount,
            estimatedDuration: audioScript.estimatedDuration,
            breathPauses: audioScript.breathPauses,
            emphasisMarkers: audioScript.emphasisMarkers
          }
        }
      });

    } catch (error) {
      logger.error('Error generating audio script:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate audio script'
      });
    }
  }

  /**
   * Preview audio script with timing
   */
  static async getAudioPreview(req, res) {
    try {
      const { scriptId } = req.params;
      const userId = req.user.id;

      const script = await ScriptGenerator.getScript(scriptId, userId);
      if (!script) {
        return res.status(404).json({
          success: false,
          error: 'Script not found'
        });
      }

      const preview = await AudioProcessor.generatePreview({
        script: script.content,
        voiceType: script.voiceType || 'professional',
        pacing: script.pacing || 'medium'
      });

      res.json({
        success: true,
        data: preview
      });

    } catch (error) {
      logger.error('Error generating audio preview:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate preview'
      });
    }
  }

  /**
   * Export script for audio reading (TXT, SRT, PDF formats)
   */
  static async exportScript(req, res) {
    try {
      const { scriptId, format } = req.params;
      const userId = req.user.id;

      const script = await ScriptGenerator.getScript(scriptId, userId);
      if (!script) {
        return res.status(404).json({
          success: false,
          error: 'Script not found'
        });
      }

      const exportData = await AudioProcessor.exportScript({
        script,
        format: format.toLowerCase() // txt, srt, pdf
      });

      // Set appropriate headers for file download
      const contentTypes = {
        txt: 'text/plain',
        srt: 'text/srt',
        pdf: 'application/pdf'
      };

      const filename = `${script.title.replace(/\s+/g, '_')}_audio_script.${format}`;

      res.setHeader('Content-Type', contentTypes[format] || 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(exportData);

    } catch (error) {
      logger.error('Error exporting script:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to export script'
      });
    }
  }
}