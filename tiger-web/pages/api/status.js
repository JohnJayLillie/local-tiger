// tiger-web/pages/api/status.js
// Health check and service status endpoint

import { getDalleService } from './services/dalle-service.js';

export default async function handler(req, res) {
  try {
    // Basic service information
    const serviceInfo = {
      success: true,
      service: 'Tiger True Crime Generator',
      version: '2.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      
      // Feature availability
      features: {
        dalle_integration: !!process.env.OPENAI_API_KEY,
        supabase_ready: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        production_ready: true,
        real_ai_generation: true
      },
      
      // API endpoints
      endpoints: [
        'POST /api/tiger/generate-episode',
        'GET /api/tiger/episode/[id]',
        'GET /api/status'
      ],
      
      // Configuration status
      configuration: {
        openai_api_configured: !!process.env.OPENAI_API_KEY,
        next_js_version: process.env.npm_package_dependencies_next || 'unknown',
        node_version: process.version
      }
    };

    // If this is a detailed health check request
    if (req.query.detailed === 'true') {
      try {
        // Test DALL-E service if API key is configured
        if (process.env.OPENAI_API_KEY) {
          console.log('🧪 Testing DALL-E service connection...');
          const dalleService = getDalleService();
          const dalleStatus = dalleService.getStatus();
          
          serviceInfo.dalle_service = {
            status: 'configured',
            ...dalleStatus
          };
          
          // Optional: Test actual connection (commented out for speed)
          // const connectionTest = await dalleService.testConnection();
          // serviceInfo.dalle_connection_test = connectionTest;
        } else {
          serviceInfo.dalle_service = {
            status: 'not_configured',
            message: 'OPENAI_API_KEY environment variable not set'
          };
        }
      } catch (error) {
        console.error('❌ DALL-E service test failed:', error);
        serviceInfo.dalle_service = {
          status: 'error',
          error: error.message
        };
      }
    }

    // Add request information
    serviceInfo.request_info = {
      method: req.method,
      url: req.url,
      user_agent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      detailed_check: req.query.detailed === 'true'
    };

    // Return status
    res.status(200).json(serviceInfo);

  } catch (error) {
    console.error('🚨 Status endpoint error:', error);
    
    // Return error status
    res.status(500).json({
      success: false,
      service: 'Tiger True Crime Generator',
      version: '2.0.0',
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * API configuration
 */
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};