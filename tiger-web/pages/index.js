// pages/index.js - Enhanced True Crime Frontend
import { useState } from 'react';
import Head from 'next/head';

export default function TigerTrueCrime() {
  const [story, setStory] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);

  const generateImages = async () => {
    if (!story.trim() || story.length < 10) {
      setError('Please enter a story of at least 10 characters');
      return;
    }

    setLoading(true);
    setImages([]);
    setError(null);
    setProgress('🎬 Starting Tiger True Crime generation...');
    
    const startTime = Date.now();
    
    try {
      setProgress('🔄 Processing your story...');
      
      const response = await fetch('/api/generate-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          story: story,
          imageCount: 6,
          platform: 'web'
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setImages(data.images);
        setMetadata(data.metadata);
        const totalTime = Math.round((Date.now() - startTime) / 1000);
        setProgress(`✅ Generation complete! ${data.metadata.successRate} images in ${totalTime}s`);
        
        // Clear progress after 5 seconds
        setTimeout(() => setProgress(''), 5000);
      } else {
        throw new Error(data.message || 'Generation failed');
      }
      
    } catch (error) {
      console.error('Generation error:', error);
      setError(`Generation failed: ${error.message}`);
      setProgress('');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (imageUrl, filename) => {
    try {
      setProgress(`📥 Downloading ${filename}...`);
      
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'tiger-crime-scene.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      setProgress(`✅ Downloaded ${filename}`);
      
      setTimeout(() => setProgress(''), 3000);
      
    } catch (error) {
      console.error('Download error:', error);
      setError('Download failed. Please try right-click → Save Image As');
    }
  };

  const downloadAll = async () => {
    const successfulImages = images.filter(img => !img.error);
    
    if (successfulImages.length === 0) {
      setError('No images available for download');
      return;
    }
    
    for (let i = 0; i < successfulImages.length; i++) {
      const image = successfulImages[i];
      await downloadImage(image.url, `tiger-crime-scene-${image.id}.jpg`);
      
      if (i < successfulImages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  const clearResults = () => {
    setImages([]);
    setMetadata(null);
    setError(null);
    setProgress('');
  };

  return (
    <>
      <Head>
        <title>🐅 Tiger True Crime - AI Documentary Image Generator</title>
        <meta name="description" content="Generate professional documentary-style images for true crime content using AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="Tiger True Crime - AI Documentary Generator" />
        <meta property="og:description" content="Create professional true crime documentary images with AI" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
              🐅 Tiger True Crime
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              AI-Powered Documentary Image Generation
            </p>
            
            {metadata && (
              <div className="inline-block bg-green-900/50 border border-green-500 rounded-lg px-6 py-3">
                <p className="text-green-300 font-medium">
                  ✅ Generated {metadata.successRate} professional images 
                  {metadata.apiStatus === 'mock' && (
                    <span className="text-yellow-300 ml-2">
                      (Demo mode - configure API for real generation)
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Story Input */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-200 mb-3">
              📝 True Crime Story
            </label>
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Enter your true crime story here... Include details about the case, location, suspects, and key events for the most accurate documentary-style images."
              rows={8}
              className="w-full p-4 bg-gray-800 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all"
              disabled={loading}
            />
            <div className="text-sm text-gray-400 mt-2 flex justify-between">
              <span>Characters: {story.length} (minimum 10 required)</span>
              <span>{story.length >= 10 ? '✅ Ready' : '⚠️ Too short'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <button
              onClick={generateImages}
              disabled={loading || story.trim().length < 10}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-8 py-4 text-lg font-bold rounded-lg transition-all duration-300 shadow-lg transform hover:scale-105 disabled:hover:scale-100"
            >
              {loading ? '🎬 Generating Images...' : '🚀 Generate Documentary Images'}
            </button>
            
            {images.length > 0 && (
              <>
                <button
                  onClick={downloadAll}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-4 text-lg font-bold rounded-lg transition-all duration-300"
                >
                  📥 Download All Images
                </button>
                <button
                  onClick={clearResults}
                  disabled={loading}
                  className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 text-white px-6 py-4 text-lg font-bold rounded-lg transition-all duration-300"
                >
                  🗑️ Clear Results
                </button>
              </>
            )}
          </div>

          {/* Progress/Error Display */}
          {progress && (
            <div className="text-center mb-8">
              <div className="inline-block bg-blue-900/50 border border-blue-500 rounded-lg px-6 py-3">
                <p className="text-blue-300 font-medium">{progress}</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="text-center mb-8">
              <div className="inline-block bg-red-900/50 border border-red-500 rounded-lg px-6 py-3">
                <p className="text-red-300 font-medium">❌ {error}</p>
              </div>
            </div>
          )}

          {/* Loading Animation */}
          {loading && (
            <div className="text-center mb-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
              <p className="text-gray-300 mt-4">Generating professional documentary images...</p>
            </div>
          )}

          {/* Images Grid */}
          {images.length > 0 && (
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-center mb-8 text-orange-400">
                Generated Documentary Images
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {images.map((image) => (
                  <div key={image.id} className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                    {!image.error ? (
                      <>
                        <div className="relative">
                          <img
                            src={image.url}
                            alt={image.scene}
                            className="w-full h-64 object-cover"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop';
                            }}
                          />
                          {image.type && (
                            <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-bold ${
                              image.type === 'real' ? 'bg-green-600' : 
                              image.type === 'mock' ? 'bg-blue-600' : 'bg-yellow-600'
                            }`}>
                              {image.type === 'real' ? 'AI Generated' : 
                               image.type === 'mock' ? 'Demo' : 'Fallback'}
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="font-bold text-xl text-orange-300 mb-3">
                            {image.scene}
                          </h3>
                          <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                            {image.prompt}
                          </p>
                          <button
                            onClick={() => downloadImage(image.url, `tiger-crime-scene-${image.id}.jpg`)}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
                          >
                            📥 Download Image
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-8 text-center">
                        <div className="text-6xl text-gray-600 mb-4">⚠️</div>
                        <h3 className="font-bold text-red-400 mb-2">Generation Failed</h3>
                        <p className="text-gray-400 text-sm">{image.prompt}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Footer */}
          <footer className="text-center text-gray-400 border-t border-gray-700 pt-8">
            <p className="text-lg mb-2">
              Powered by Tiger AI • DALL-E 3 • Professional Documentary Quality
            </p>
            <p className="text-sm">
              Production Version 1.0.0 • Built for DigitalOcean • {new Date().getFullYear()}
            </p>
            {metadata && (
              <p className="text-xs mt-2 opacity-75">
                Generated at {new Date(metadata.generatedAt).toLocaleString()}
              </p>
            )}
          </footer>
        </div>
      </div>
    </>
  );
}