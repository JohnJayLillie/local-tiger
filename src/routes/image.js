// src/routes/image.js - Image Generation, Download, and Processing Routes
import express from 'express';
import multer from 'multer';
import { authenticateUser } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { ImageController } from '../controllers/ImageController.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// ================================================================
// IMAGE GENERATION ROUTES
// ================================================================

/**
 * Generate image using DALL-E or Stable Diffusion
 */
router.post('/generate', 
  authenticateUser,
  validateRequest(['prompt', 'style', 'dimensions']),
  ImageController.generateImage
);

/**
 * Get generated images for user
 */
router.get('/gallery', 
  authenticateUser,
  ImageController.getUserImages
);

// ================================================================
// IMAGE DOWNLOAD ROUTES
// ================================================================

/**
 * Download image by ID
 * NEW FEATURE: Be able to download images
 */
router.get('/:imageId/download', 
  authenticateUser,
  ImageController.downloadImage
);

/**
 * Download multiple images as ZIP
 * NEW FEATURE: Batch download capability
 */
router.post('/download/batch', 
  authenticateUser,
  validateRequest(['imageIds']),
  ImageController.downloadBatch
);

/**
 * Download image with custom format/size
 */
router.get('/:imageId/download/:format/:size', 
  authenticateUser,
  ImageController.downloadCustomImage
);

// ================================================================
// IMAGE PROCESSING ROUTES
// ================================================================

/**
 * Apply polaroid border to image
 * NEW FEATURE: Attach polaroid borders
 */
router.post('/:imageId/polaroid', 
  authenticateUser,
  ImageController.addPolaroidBorder
);

/**
 * Apply polaroid border to uploaded image
 */
router.post('/polaroid/upload', 
  authenticateUser,
  upload.single('image'),
  ImageController.uploadAndAddPolaroid
);

/**
 * Get polaroid border options/styles
 */
router.get('/polaroid/styles', 
  authenticateUser,
  ImageController.getPolaroidStyles
);

/**
 * Apply custom image filters
 */
router.post('/:imageId/filter', 
  authenticateUser,
  validateRequest(['filterType', 'intensity']),
  ImageController.applyFilter
);

// ================================================================
// IMAGE MANAGEMENT ROUTES
// ================================================================

/**
 * Get image metadata and details
 */
router.get('/:imageId', 
  authenticateUser,
  ImageController.getImage
);

/**
 * Update image metadata
 */
router.put('/:imageId', 
  authenticateUser,
  ImageController.updateImage
);

/**
 * Delete image
 */
router.delete('/:imageId', 
  authenticateUser,
  ImageController.deleteImage
);

/**
 * Search images by tags/metadata
 */
router.post('/search', 
  authenticateUser,
  validateRequest(['query']),
  ImageController.searchImages
);

export { router as imageRoutes };