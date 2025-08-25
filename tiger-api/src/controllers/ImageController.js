// tiger-api/src/controllers/ImageController.js - Image Generation, Download, and Processing Logic
import { DalleService } from '../services/image/DalleService.js';
import { ImageProcessor } from '../services/image/ImageProcessor.js';
import { PolaroidFilter } from '../services/image/PolaroidFilter.js';
import { logger } from '../utils/logger.js';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';

export class ImageController {

  /**
   * Generate image using DALL-E or Stable Diffusion
   */
  static async generateImage(req, res) {
    try {
      const { prompt, style, dimensions = '1024x1024', model = 'dall-e-3' } = req.body;
      const userId = req.user.id;

      logger.info(`Generating image for user ${userId}`);

      const generatedImage = await DalleService.generateImage({
        prompt,
        style,
        dimensions,
        model,
        userId
      });

      res.json({
        success: true,
        data: {
          imageId: generatedImage.id,
          url: generatedImage.url,
          prompt: generatedImage.prompt,
          style: generatedImage.style,
          dimensions: generatedImage.dimensions,
          createdAt: generatedImage.createdAt
        }
      });

    } catch (error) {
      logger.error('Error generating image:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate image'
      });
    }
  }

  /**
   * Get generated images for user
   */
  static async getUserImages(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20, style, sortBy = 'createdAt' } = req.query;

      const images = await DalleService.getUserImages({
        userId,
        page: parseInt(page),
        limit: parseInt(limit),
        style,
        sortBy
      });

      res.json({
        success: true,
        data: images
      });

    } catch (error) {
      logger.error('Error fetching user images:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch images'
      });
    }
  }

  /**
   * Download image by ID
   * NEW FEATURE: Be able to download images
   */
  static async downloadImage(req, res) {
    try {
      const { imageId } = req.params;
      const userId = req.user.id;

      const image = await DalleService.getImage(imageId, userId);
      if (!image) {
        return res.status(404).json({
          success: false,
          error: 'Image not found'
        });
      }

      // Download image data
      const imageBuffer = await ImageProcessor.downloadImageBuffer(image.url);
      
      // Set headers for download
      const filename = `tiger_image_${imageId}.png`;
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      // Track download
      await DalleService.trackDownload(imageId, userId);
      
      res.send(imageBuffer);

    } catch (error) {
      logger.error('Error downloading image:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to download image'
      });
    }
  }

  /**
   * Download multiple images as ZIP
   * NEW FEATURE: Batch download capability
   */
  static async downloadBatch(req, res) {
    try {
      const { imageIds } = req.body;
      const userId = req.user.id;

      if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid image IDs provided'
        });
      }

      // Limit batch size
      if (imageIds.length > 50) {
        return res.status(400).json({
          success: false,
          error: 'Maximum 50 images per batch download'
        });
      }

      const images = await DalleService.getImagesBatch(imageIds, userId);
      
      // Create ZIP archive
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="tiger_images_batch.zip"');
      
      archive.pipe(res);

      // Add each image to archive
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        try {
          const imageBuffer = await ImageProcessor.downloadImageBuffer(image.url);
          const filename = `${image.prompt.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_${image.id}.png`;
          archive.append(imageBuffer, { name: filename });
        } catch (imageError) {
          logger.warn(`Failed to add image ${image.id} to batch:`, imageError);
        }
      }

      // Track batch download
      await DalleService.trackBatchDownload(imageIds, userId);

      archive.finalize();

    } catch (error) {
      logger.error('Error creating batch download:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create batch download'
      });
    }
  }

  /**
   * Download image with custom format/size
   */
  static async downloadCustomImage(req, res) {
    try {
      const { imageId, format, size } = req.params;
      const userId = req.user.id;

      const image = await DalleService.getImage(imageId, userId);
      if (!image) {
        return res.status(404).json({
          success: false,
          error: 'Image not found'
        });
      }

      // Process image with custom format and size
      const processedImage = await ImageProcessor.processImage({
        imageUrl: image.url,
        format: format.toLowerCase(), // png, jpg, webp
        size: size // small, medium, large, or WxH
      });

      const mimeTypes = {
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        webp: 'image/webp'
      };

      const filename = `tiger_image_${imageId}_${size}.${format}`;
      res.setHeader('Content-Type', mimeTypes[format.toLowerCase()] || 'image/png');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      res.send(processedImage);

    } catch (error) {
      logger.error('Error downloading custom image:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to download custom image'
      });
    }
  }

  /**
   * Apply polaroid border to image
   * NEW FEATURE: Attach polaroid borders
   */
  static async addPolaroidBorder(req, res) {
    try {
      const { imageId } = req.params;
      const { style = 'classic', color = 'white', caption = '' } = req.body;
      const userId = req.user.id;

      const image = await DalleService.getImage(imageId, userId);
      if (!image) {
        return res.status(404).json({
          success: false,
          error: 'Image not found'
        });
      }

      // Apply polaroid border
      const polaroidImage = await PolaroidFilter.applyPolaroidBorder({
        imageUrl: image.url,
        style,
        color,
        caption
      });

      // Save processed image
      const savedPolaroid = await DalleService.savePolaroidVersion({
        originalImageId: imageId,
        userId,
        polaroidUrl: polaroidImage.url,
        style,
        color,
        caption
      });

      res.json({
        success: true,
        data: {
          polaroidId: savedPolaroid.id,
          url: polaroidImage.url,
          originalImageId: imageId,
          style,
          color,
          caption,
          createdAt: savedPolaroid.createdAt
        }
      });

    } catch (error) {
      logger.error('Error adding polaroid border:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add polaroid border'
      });
    }
  }

  /**
   * Apply polaroid border to uploaded image
   */
  static async uploadAndAddPolaroid(req, res) {
    try {
      const { style = 'classic', color = 'white', caption = '' } = req.body;
      const userId = req.user.id;
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No image file uploaded'
        });
      }

      // Process uploaded image
      const uploadedImagePath = req.file.path;
      
      // Apply polaroid border to uploaded image
      const polaroidImage = await PolaroidFilter.applyPolaroidBorderToFile({
        imagePath: uploadedImagePath,
        style,
        color,
        caption
      });

      // Save to database
      const savedImage = await DalleService.saveUploadedPolaroid({
        userId,
        originalFileName: req.file.originalname,
        polaroidUrl: polaroidImage.url,
        style,
        color,
        caption
      });

      // Clean up uploaded file
      fs.unlinkSync(uploadedImagePath);

      res.json({
        success: true,
        data: {
          imageId: savedImage.id,
          url: polaroidImage.url,
          style,
          color,
          caption,
          createdAt: savedImage.createdAt
        }
      });

    } catch (error) {
      logger.error('Error processing uploaded polaroid:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process uploaded image'
      });
    }
  }

  /**
   * Get polaroid border options/styles
   */
  static async getPolaroidStyles(req, res) {
    try {
      const styles = await PolaroidFilter.getAvailableStyles();

      res.json({
        success: true,
        data: {
          styles: styles.map(style => ({
            id: style.id,
            name: style.name,
            description: style.description,
            previewUrl: style.previewUrl,
            colors: style.availableColors
          }))
        }
      });

    } catch (error) {
      logger.error('Error fetching polaroid styles:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch polaroid styles'
      });
    }
  }

  /**
   * Apply custom image filters
   */
  static async applyFilter(req, res) {
    try {
      const { imageId } = req.params;
      const { filterType, intensity = 0.5 } = req.body;
      const userId = req.user.id;

      const image = await DalleService.getImage(imageId, userId);
      if (!image) {
        return res.status(404).json({
          success: false,
          error: 'Image not found'
        });
      }

      const filteredImage = await ImageProcessor.applyFilter({
        imageUrl: image.url,
        filterType, // vintage, sepia, black_white, etc.
        intensity
      });

      // Save filtered version
      const savedFiltered = await DalleService.saveFilteredVersion({
        originalImageId: imageId,
        userId,
        filteredUrl: filteredImage.url,
        filterType,
        intensity
      });

      res.json({
        success: true,
        data: {
          filteredId: savedFiltered.id,
          url: filteredImage.url,
          originalImageId: imageId,
          filterType,
          intensity,
          createdAt: savedFiltered.createdAt
        }
      });

    } catch (error) {
      logger.error('Error applying filter:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to apply filter'
      });
    }
  }

  // ... Additional methods for getImage, updateImage, deleteImage, searchImages
}// tiger-api/src/controllers/ImageController.js - Image Generation, Download, and Processing Logic
import { DalleService } from '../services/image/DalleService.js';
import { ImageProcessor } from '../services/image/ImageProcessor.js';
import { PolaroidFilter } from '../services/image/PolaroidFilter.js';
import { logger } from '../utils/logger.js';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';

export class ImageController {

  /**
   * Generate image using DALL-E or Stable Diffusion
   */
  static async generateImage(req, res) {
    try {
      const { prompt, style, dimensions = '1024x1024', model = 'dall-e-3' } = req.body;
      const userId = req.user.id;

      logger.info(`Generating image for user ${userId}`);

      const generatedImage = await DalleService.generateImage({
        prompt,
        style,
        dimensions,
        model,
        userId
      });

      res.json({
        success: true,
        data: {
          imageId: generatedImage.id,
          url: generatedImage.url,
          prompt: generatedImage.prompt,
          style: generatedImage.style,
          dimensions: generatedImage.dimensions,
          createdAt: generatedImage.createdAt
        }
      });

    } catch (error) {
      logger.error('Error generating image:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate image'
      });
    }
  }

  /**
   * Get generated images for user
   */
  static async getUserImages(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20, style, sortBy = 'createdAt' } = req.query;

      const images = await DalleService.getUserImages({
        userId,
        page: parseInt(page),
        limit: parseInt(limit),
        style,
        sortBy
      });

      res.json({
        success: true,
        data: images
      });

    } catch (error) {
      logger.error('Error fetching user images:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch images'
      });
    }
  }

  /**
   * Download image by ID
   * NEW FEATURE: Be able to download images
   */
  static async downloadImage(req, res) {
    try {
      const { imageId } = req.params;
      const userId = req.user.id;

      const image = await DalleService.getImage(imageId, userId);
      if (!image) {
        return res.status(404).json({
          success: false,
          error: 'Image not found'
        });
      }

      // Download image data
      const imageBuffer = await ImageProcessor.downloadImageBuffer(image.url);
      
      // Set headers for download
      const filename = `tiger_image_${imageId}.png`;
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      // Track download
      await DalleService.trackDownload(imageId, userId);
      
      res.send(imageBuffer);

    } catch (error) {
      logger.error('Error downloading image:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to download image'
      });
    }
  }

  /**
   * Download multiple images as ZIP
   * NEW FEATURE: Batch download capability
   */
  static async downloadBatch(req, res) {
    try {
      const { imageIds } = req.body;
      const userId = req.user.id;

      if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid image IDs provided'
        });
      }

      // Limit batch size
      if (imageIds.length > 50) {
        return res.status(400).json({
          success: false,
          error: 'Maximum 50 images per batch download'
        });
      }

      const images = await DalleService.getImagesBatch(imageIds, userId);
      
      // Create ZIP archive
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="tiger_images_batch.zip"');
      
      archive.pipe(res);

      // Add each image to archive
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        try {
          const imageBuffer = await ImageProcessor.downloadImageBuffer(image.url);
          const filename = `${image.prompt.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_${image.id}.png`;
          archive.append(imageBuffer, { name: filename });
        } catch (imageError) {
          logger.warn(`Failed to add image ${image.id} to batch:`, imageError);
        }
      }

      // Track batch download
      await DalleService.trackBatchDownload(imageIds, userId);

      archive.finalize();

    } catch (error) {
      logger.error('Error creating batch download:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create batch download'
      });
    }
  }

  /**
   * Download image with custom format/size
   */
  static async downloadCustomImage(req, res) {
    try {
      const { imageId, format, size } = req.params;
      const userId = req.user.id;

      const image = await DalleService.getImage(imageId, userId);
      if (!image) {
        return res.status(404).json({
          success: false,
          error: 'Image not found'
        });
      }

      // Process image with custom format and size
      const processedImage = await ImageProcessor.processImage({
        imageUrl: image.url,
        format: format.toLowerCase(), // png, jpg, webp
        size: size // small, medium, large, or WxH
      });

      const mimeTypes = {
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        webp: 'image/webp'
      };

      const filename = `tiger_image_${imageId}_${size}.${format}`;
      res.setHeader('Content-Type', mimeTypes[format.toLowerCase()] || 'image/png');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      res.send(processedImage);

    } catch (error) {
      logger.error('Error downloading custom image:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to download custom image'
      });
    }
  }

  /**
   * Apply polaroid border to image
   * NEW FEATURE: Attach polaroid borders
   */
  static async addPolaroidBorder(req, res) {
    try {
      const { imageId } = req.params;
      const { style = 'classic', color = 'white', caption = '' } = req.body;
      const userId = req.user.id;

      const image = await DalleService.getImage(imageId, userId);
      if (!image) {
        return res.status(404).json({
          success: false,
          error: 'Image not found'
        });
      }

      // Apply polaroid border
      const polaroidImage = await PolaroidFilter.applyPolaroidBorder({
        imageUrl: image.url,
        style,
        color,
        caption
      });

      // Save processed image
      const savedPolaroid = await DalleService.savePolaroidVersion({
        originalImageId: imageId,
        userId,
        polaroidUrl: polaroidImage.url,
        style,
        color,
        caption
      });

      res.json({
        success: true,
        data: {
          polaroidId: savedPolaroid.id,
          url: polaroidImage.url,
          originalImageId: imageId,
          style,
          color,
          caption,
          createdAt: savedPolaroid.createdAt
        }
      });

    } catch (error) {
      logger.error('Error adding polaroid border:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add polaroid border'
      });
    }
  }

  /**
   * Apply polaroid border to uploaded image
   */
  static async uploadAndAddPolaroid(req, res) {
    try {
      const { style = 'classic', color = 'white', caption = '' } = req.body;
      const userId = req.user.id;
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No image file uploaded'
        });
      }

      // Process uploaded image
      const uploadedImagePath = req.file.path;
      
      // Apply polaroid border to uploaded image
      const polaroidImage = await PolaroidFilter.applyPolaroidBorderToFile({
        imagePath: uploadedImagePath,
        style,
        color,
        caption
      });

      // Save to database
      const savedImage = await DalleService.saveUploadedPolaroid({
        userId,
        originalFileName: req.file.originalname,
        polaroidUrl: polaroidImage.url,
        style,
        color,
        caption
      });

      // Clean up uploaded file
      fs.unlinkSync(uploadedImagePath);

      res.json({
        success: true,
        data: {
          imageId: savedImage.id,
          url: polaroidImage.url,
          style,
          color,
          caption,
          createdAt: savedImage.createdAt
        }
      });

    } catch (error) {
      logger.error('Error processing uploaded polaroid:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process uploaded image'
      });
    }
  }

  /**
   * Get polaroid border options/styles
   */
  static async getPolaroidStyles(req, res) {
    try {
      const styles = await PolaroidFilter.getAvailableStyles();

      res.json({
        success: true,
        data: {
          styles: styles.map(style => ({
            id: style.id,
            name: style.name,
            description: style.description,
            previewUrl: style.previewUrl,
            colors: style.availableColors
          }))
        }
      });

    } catch (error) {
      logger.error('Error fetching polaroid styles:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch polaroid styles'
      });
    }
  }

  /**
   * Apply custom image filters
   */
  static async applyFilter(req, res) {
    try {
      const { imageId } = req.params;
      const { filterType, intensity = 0.5 } = req.body;
      const userId = req.user.id;

      const image = await DalleService.getImage(imageId, userId);
      if (!image) {
        return res.status(404).json({
          success: false,
          error: 'Image not found'
        });
      }

      const filteredImage = await ImageProcessor.applyFilter({
        imageUrl: image.url,
        filterType, // vintage, sepia, black_white, etc.
        intensity
      });

      // Save filtered version
      const savedFiltered = await DalleService.saveFilteredVersion({
        originalImageId: imageId,
        userId,
        filteredUrl: filteredImage.url,
        filterType,
        intensity
      });

      res.json({
        success: true,
        data: {
          filteredId: savedFiltered.id,
          url: filteredImage.url,
          originalImageId: imageId,
          filterType,
          intensity,
          createdAt: savedFiltered.createdAt
        }
      });

    } catch (error) {
      logger.error('Error applying filter:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to apply filter'
      });
    }
  }

  // ... Additional methods for getImage, updateImage, deleteImage, searchImages
}