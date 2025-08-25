// tiger-api/src/routes/script.js - Script Generation and Audio Reading Routes
import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { ScriptController } from '../controllers/ScriptController.js';

const router = express.Router();

// ================================================================
// SCRIPT GENERATION ROUTES
// ================================================================

/**
 * Generate a script from content input
 * NEW FEATURE: Generate, display and save a script for audio reading
 */
router.post('/generate', 
  authenticateUser,
  validateRequest(['content', 'platform', 'tone']),
  ScriptController.generateScript
);

/**
 * Get all user scripts
 */
router.get('/list', 
  authenticateUser,
  ScriptController.getUserScripts
);

/**
 * Get specific script by ID
 */
router.get('/:scriptId', 
  authenticateUser,
  ScriptController.getScript
);

/**
 * Save/Update script
 * NEW FEATURE: Save scripts for audio reading
 */
router.put('/:scriptId', 
  authenticateUser,
  validateRequest(['title', 'content']),
  ScriptController.saveScript
);

/**
 * Delete script
 */
router.delete('/:scriptId', 
  authenticateUser,
  ScriptController.deleteScript
);

// ================================================================
// AUDIO READING ROUTES
// ================================================================

/**
 * Generate audio-optimized script
 * NEW FEATURE: Format script specifically for audio reading
 */
router.post('/audio-format', 
  authenticateUser,
  validateRequest(['scriptId', 'voiceType', 'pacing']),
  ScriptController.generateAudioScript
);

/**
 * Preview audio script with timing
 */
router.get('/:scriptId/audio-preview', 
  authenticateUser,
  ScriptController.getAudioPreview
);

/**
 * Export script for audio reading (TXT, SRT, PDF formats)
 */
router.get('/:scriptId/export/:format', 
  authenticateUser,
  ScriptController.exportScript
);

export { router as scriptRoutes };