// tiger-api/src/index.js - Main Entry Point (Reduced to ~100 lines)
import express from 'express';
import cors from 'cors';
import { authRoutes } from './routes/auth.js';
import { videoRoutes } from './routes/video.js';
import { scriptRoutes } from './routes/script.js';
import { imageRoutes } from './routes/image.js';
import { aiRoutes } from './routes/ai.js';
import { complianceRoutes } from './routes/compliance.js';
import { analyticsRoutes } from './routes/analytics.js';
import { userRoutes } from './routes/user.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { logger } from './utils/logger.js';
import { initializeDatabase } from './config/database.js';

const app = express();
const PORT = process.env.PORT || 8000;

// Initialize middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(rateLimiter);

// Initialize database
await initializeDatabase();

// Route mounting
app.use('/api/auth', authRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/script', scriptRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'healthy', timestamp: new Date().toISOString() }));

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Tiger Platform API running on port ${PORT}`);
});

// ================================================================
// PROPOSED DIRECTORY STRUCTURE:
// ================================================================
/*
src/
├── index.js                 (Main entry - THIS FILE - ~100 lines)
├── config/
│   ├── database.js         (Database configuration)
│   ├── ai-services.js      (AI API configurations)
│   └── storage.js          (File storage configuration)
├── routes/
│   ├── auth.js            (Authentication routes)
│   ├── video.js           (Video generation routes)
│   ├── script.js          (Script generation routes)
│   ├── image.js           (Image generation/download routes)
│   ├── ai.js              (AI coaching/prompt routes)
│   ├── compliance.js      (Legal compliance routes)
│   ├── analytics.js       (Analytics routes)
│   └── user.js            (User management routes)
├── controllers/
│   ├── VideoController.js
│   ├── ScriptController.js
│   ├── ImageController.js
│   ├── AIController.js
│   ├── ComplianceController.js
│   └── UserController.js
├── services/
│   ├── video/
│   │   ├── RunwayService.js
│   │   ├── StableDiffusionService.js
│   │   └── VideoProcessor.js
│   ├── ai/
│   │   ├── OpenAIService.js
│   │   ├── AnthropicService.js
│   │   └── PromptOptimizer.js
│   ├── image/
│   │   ├── DalleService.js
│   │   ├── ImageProcessor.js
│   │   └── PolaroidFilter.js
│   └── script/
│       ├── ScriptGenerator.js
│       ├── AudioProcessor.js
│       └── ContentOptimizer.js
├── middleware/
│   ├── auth.js
│   ├── rateLimiter.js
│   ├── errorHandler.js
│   ├── fileUpload.js
│   └── validation.js
├── models/
│   ├── User.js
│   ├── Project.js
│   ├── Script.js
│   └── Asset.js
├── utils/
│   ├── logger.js
│   ├── fileHandler.js
│   ├── helpers.js
│   └── constants.js
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
*/

// BENEFITS OF THIS MODULAR APPROACH:
/*
1. 🎯 MAINTAINABILITY
   - Each file has a single responsibility
   - Easy to locate and fix bugs
   - Clear code organization

2. 🚀 PERFORMANCE
   - Faster startup time (only load what's needed)
   - Better memory usage
   - Improved caching strategies

3. 👥 TEAM COLLABORATION
   - Multiple developers can work simultaneously
   - Clear ownership of components
   - Easier code reviews

4. 🧪 TESTING
   - Unit tests for individual components
   - Mock services easily
   - Isolated testing environments

5. 📈 SCALABILITY
   - Add new features without touching existing code
   - Microservices-ready architecture
   - Easy to deploy individual components
*/