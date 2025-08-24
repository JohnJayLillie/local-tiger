// tiger-web/pages/index.js
// Main frontend application for Tiger True Crime Generator

import { useState, useEffect } from 'react';
import { Loader2, Download, Eye, Clock, CheckCircle, AlertCircle, Play, Pause } from 'lucide-react';

export default function TigerGenerator() {
  const [episodeData, setEpisodeData] = useState({
    title: '',
    description: '',
    characters: [{ name: '', role: '', description: '' }],
    locations: [{ name: '', significance: '' }],
    time_period: '1990s'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [apiStatus, setApiStatus] = useState(null);
  const [errors, setErrors] = useState({});

  // Check API status on component mount
  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      const response = await fetch('/api/status?detailed=true');
      const status = await response.json();
      setApiStatus(status);
    } catch (error) {
      console.error('Failed to check API status:', error);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!episodeData.title || episodeData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!episodeData.description || episodeData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    episodeData.characters.forEach((char, index) => {
      if (char.name && char.name.trim() && char.name.length > 50) {
        newErrors[`character_${index}`] = 'Character name too long (max 50 characters)';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addCharacter = () => {
    if (episodeData.characters.length < 4) {
      setEpisodeData({
        ...episodeData,
        characters: [...episodeData.characters, { name: '', role: '', description: '' }]
      });
    }
  };

  const addLocation = () => {
    if (episodeData.locations.length < 3) {
      setEpisodeData({
        ...episodeData,
        locations: [...episodeData.locations, { name: '', significance: '' }]
      });
    }
  };

  const updateCharacter = (index, field, value) => {
    const updated = [...episodeData.characters];
    updated[index][field] = value;
    setEpisodeData({ ...episodeData, characters: updated });
    
    // Clear error when user starts typing
    if (errors[`character_${index}`]) {
      const newErrors = { ...errors };
      delete newErrors[`character_${index}`];
      setErrors(newErrors);
    }
  };

  const updateLocation = (index, field, value) => {
    const updated = [...episodeData.locations];
    updated[index][field] = value;
    setEpisodeData({ ...episodeData, locations: updated });
  };

  const removeCharacter = (index) => {
    if (episodeData.characters.length > 1) {
      const updated = episodeData.characters.filter((_, i) => i !== index);
      setEpisodeData({ ...episodeData, characters: updated });
    }
  };

  const removeLocation = (index) => {
    if (episodeData.locations.length > 1) {
      const updated = episodeData.locations.filter((_, i) => i !== index);
      setEpisodeData({ ...episodeData, locations: updated });
    }
  };

  const simulateProgress = () => {
    setGenerationProgress(0);
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 12;
      });
    }, 3000); // Slower progress updates for realism
    return interval;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsGenerating(true);
    setResult(null);
    setErrors({});
    
    const progressInterval = simulateProgress();
    
    try {
      console.log('🐅 Starting episode generation...');
      
      const response = await fetch('/api/tiger/generate-episode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(episodeData)
      });
      
      const data = await response.json();
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      setTimeout(() => {
        setResult(data);
        setIsGenerating(false);
        setGenerationProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error('Generation failed:', error);
      clearInterval(progressInterval);
      setResult({
        success: false,
        error: 'Network error. Please check your connection and try again.'
      });
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const downloadImage = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const clearForm = () => {
    setEpisodeData({
      title: '',
      description: '',
      characters: [{ name: '', role: '', description: '' }],
      locations: [{ name: '', significance: '' }],
      time_period: '1990s'
    });
    setResult(null);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-orange-500/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🐅</div>
              <div>
                <h1 className="text-2xl font-bold text-orange-400">Tiger True Crime Generator</h1>
                <p className="text-gray-400 text-sm">AI-Powered Documentary Content Creation</p>
              </div>
            </div>
            
            {/* API Status Indicator */}
            {apiStatus && (
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  apiStatus.features?.dalle_integration ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <span className="text-sm text-gray-400">
                  {apiStatus.features?.dalle_integration ? 'AI Ready' : 'AI Not Configured'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Input Form */}
          <div className="space-y-6">
            
            {/* Episode Details */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-orange-400">Episode Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Episode Title*</label>
                  <input
                    type="text"
                    value={episodeData.title}
                    onChange={(e) => {
                      setEpisodeData({...episodeData, title: e.target.value});
                      if (errors.title) {
                        const newErrors = { ...errors };
                        delete newErrors.title;
                        setErrors(newErrors);
                      }
                    }}
                    className={`w-full p-3 rounded-lg bg-gray-700 border ${
                      errors.title ? 'border-red-500' : 'border-gray-600'
                    } focus:border-orange-500 focus:outline-none`}
                    placeholder="The Missing Heiress"
                    maxLength={100}
                  />
                  {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description*</label>
                  <textarea
                    value={episodeData.description}
                    onChange={(e) => {
                      setEpisodeData({...episodeData, description: e.target.value});
                      if (errors.description) {
                        const newErrors = { ...errors };
                        delete newErrors.description;
                        setErrors(newErrors);
                      }
                    }}
                    className={`w-full p-3 rounded-lg bg-gray-700 border ${
                      errors.description ? 'border-red-500' : 'border-gray-600'
                    } focus:border-orange-500 focus:outline-none h-24 resize-none`}
                    placeholder="A wealthy socialite vanishes without a trace from her Manhattan penthouse..."
                    maxLength={500}
                  />
                  {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                  <p className="text-xs text-gray-400 mt-1">{episodeData.description.length}/500 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Time Period</label>
                  <select
                    value={episodeData.time_period}
                    onChange={(e) => setEpisodeData({...episodeData, time_period: e.target.value})}
                    className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="1980s">1980s</option>
                    <option value="1990s">1990s</option>
                    <option value="2000s">2000s</option>
                    <option value="2010s">2010s</option>
                    <option value="2020s">2020s</option>
                  </select>
                </div>
              </form>
            </div>

            {/* Characters Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-orange-400">Characters (Max 4)</h3>
                <button
                  type="button"
                  onClick={addCharacter}
                  disabled={episodeData.characters.length >= 4}
                  className="px-3 py-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm transition-colors"
                >
                  Add Character
                </button>
              </div>
              
              {episodeData.characters.map((character, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Character {index + 1}</span>
                    {episodeData.characters.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCharacter(index)}
                        className="text-red-400 hover:text-red-300 text-sm transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Name"
                      value={character.name}
                      onChange={(e) => updateCharacter(index, 'name', e.target.value)}
                      className={`p-2 rounded bg-gray-600 border ${
                        errors[`character_${index}`] ? 'border-red-500' : 'border-gray-500'
                      } focus:border-orange-500 focus:outline-none text-sm`}
                      maxLength={50}
                    />
                    <input
                      type="text"
                      placeholder="Role"
                      value={character.role}
                      onChange={(e) => updateCharacter(index, 'role', e.target.value)}
                      className="p-2 rounded bg-gray-600 border border-gray-500 focus:border-orange-500 focus:outline-none text-sm"
                      maxLength={50}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={character.description}
                    onChange={(e) => updateCharacter(index, 'description', e.target.value)}
                    className="w-full p-2 rounded bg-gray-600 border border-gray-500 focus:border-orange-500 focus:outline-none text-sm mt-2"
                    maxLength={100}
                  />
                  {errors[`character_${index}`] && (
                    <p className="text-red-400 text-xs mt-1">{errors[`character_${index}`]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Locations Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-orange-400">Locations (Max 3)</h3>
                <button
                  type="button"
                  onClick={addLocation}
                  disabled={episodeData.locations.length >= 3}
                  className="px-3 py-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm transition-colors"
                >
                  Add Location
                </button>
              </div>
              
              {episodeData.locations.map((location, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Location {index + 1}</span>
                    {episodeData.locations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLocation(index)}
                        className="text-red-400 hover:text-red-300 text-sm transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <input
                      type="text"
                      placeholder="Location Name"
                      value={location.name}
                      onChange={(e) => updateLocation(index, 'name', e.target.value)}
                      className="p-2 rounded bg-gray-600 border border-gray-500 focus:border-orange-500 focus:outline-none text-sm"
                      maxLength={50}
                    />
                    <input
                      type="text"
                      placeholder="Significance (optional)"
                      value={location.significance}
                      onChange={(e) => updateLocation(index, 'significance', e.target.value)}
                      className="p-2 rounded bg-gray-600 border border-gray-500 focus:border-orange-500 focus:outline-none text-sm"
                      maxLength={100}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleSubmit}
                disabled={isGenerating || !episodeData.title || !episodeData.description || !apiStatus?.features?.dalle_integration}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-600 px-6 py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 transition-all disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Generating Images...</span>
                  </>
                ) : (
                  <>
                    <span>🎬 Generate Episode</span>
                  </>
                )}
              </button>
              
              {!isGenerating && (
                <button
                  onClick={clearForm}
                  className="w-full bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  Clear Form
                </button>
              )}
            </div>

            {/* Progress Bar */}
            {isGenerating && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Generating AI images...</span>
                  <span>{Math.round(generationProgress)}%</span>
                </div>
                <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-500"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">Estimated time: 3-5 minutes</p>
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Generation Status */}
            {isGenerating && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                  <Loader2 className="animate-spin text-orange-400" size={24} />
                  <h2 className="text-xl font-semibold text-orange-400">Generating Images</h2>
                </div>
                <div className="space-y-2 text-gray-300">
                  <p className="flex items-center space-x-2">
                    <Clock size={16} />
                    <span>Estimated time: 3-5 minutes</span>
                  </p>
                  <p className="text-sm text-gray-400">AI is creating professional documentary-quality images using DALL-E-3...</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mt-4">
                    <p>✓ Professional thumbnail</p>
                    <p>✓ Character portraits</p>
                    <p>✓ Location establishing shots</p>
                    <p>✓ HD 1024x1024 quality</p>
                  </div>
                </div>
              </div>
            )}

            {/* Results Display */}
            {result && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                  {result.success ? (
                    <CheckCircle className="text-green-400" size={24} />
                  ) : (
                    <AlertCircle className="text-red-400" size={24} />
                  )}
                  <h2 className="text-xl font-semibold text-orange-400">
                    {result.success ? 'Generation Complete' : 'Generation Failed'}
                  </h2>
                </div>

                {result.success ? (
                  <div className="space-y-6">
                    {/* Success Summary */}
                    <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                      <p className="text-green-400 font-medium">
                        ✅ Generated {result.episode.metadata.total_images_generated} professional images
                      </p>
                      <p className="text-gray-300 text-sm mt-1">
                        Generation time: {result.episode.generation_time} | Quality: {result.episode.metadata.quality} | AI: {result.episode.metadata.ai_service}
                      </p>
                    </div>

                    {/* Thumbnail */}
                    {result.episode.images.thumbnail && (
                      <div>
                        <h3 className="font-semibold mb-3 text-orange-400 flex items-center space-x-2">
                          <span>📸 Episode Thumbnail</span>
                        </h3>
                        <div className="relative group">
                          <img 
                            src={result.episode.images.thumbnail.url} 
                            alt="Episode thumbnail"
                            className="w-full max-w-md rounded-lg border border-gray-600 shadow-lg hover:shadow-xl transition-shadow"
                            loading="lazy"
                          />
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => downloadImage(
                                result.episode.images.thumbnail.url, 
                                `${result.episode.title.replace(/[^a-zA-Z0-9]/g, '_')}_thumbnail.jpg`
                              )}
                              className="bg-black/70 hover:bg-black/90 p-2 rounded-lg transition-colors"
                              title="Download thumbnail"
                            >
                              <Download size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Characters */}
                    {result.episode.images.characters?.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3 text-orange-400 flex items-center space-x-2">
                          <span>👥 Character Portraits</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {result.episode.images.characters.map((char, i) => (
                            <div key={i} className="relative group">
                              <p className="text-sm mb-2 font-medium">{char.character_name}</p>
                              <img 
                                src={char.url} 
                                alt={char.character_name}
                                className="w-full rounded-lg border border-gray-600 shadow-lg hover:shadow-xl transition-shadow"
                                loading="lazy"
                              />
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => downloadImage(
                                    char.url, 
                                    `${char.character_name.replace(/[^a-zA-Z0-9]/g, '_')}_portrait.jpg`
                                  )}
                                  className="bg-black/70 hover:bg-black/90 p-2 rounded-lg transition-colors"
                                  title={`Download ${char.character_name} portrait`}
                                >
                                  <Download size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Locations */}
                    {result.episode.images.locations?.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3 text-orange-400 flex items-center space-x-2">
                          <span>📍 Location Shots</span>
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          {result.episode.images.locations.map((loc, i) => (
                            <div key={i} className="relative group">
                              <p className="text-sm mb-2 font-medium">{loc.location_name}</p>
                              <img 
                                src={loc.url} 
                                alt={loc.location_name}
                                className="w-full max-w-md rounded-lg border border-gray-600 shadow-lg hover:shadow-xl transition-shadow"
                                loading="lazy"
                              />
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => downloadImage(
                                    loc.url, 
                                    `${loc.location_name.replace(/[^a-zA-Z0-9]/g, '_')}_location.jpg`
                                  )}
                                  className="bg-black/70 hover:bg-black/90 p-2 rounded-lg transition-colors"
                                  title={`Download ${loc.location_name} location shot`}
                                >
                                  <Download size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Episode Info */}
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <h4 className="font-medium text-gray-300 mb-2">Episode Information</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                        <div>
                          <p><strong>ID:</strong> {result.episode.id}</p>
                          <p><strong>Created:</strong> {new Date(result.episode.created_at).toLocaleString()}</p>
                        </div>
                        <div>
                          <p><strong>Characters:</strong> {result.episode.metadata.characters_count}</p>
                          <p><strong>Locations:</strong> {result.episode.metadata.locations_count}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                    <p className="text-red-400 font-medium">❌ {result.error}</p>
                    {result.details && (
                      <p className="text-gray-300 text-sm mt-1">{result.details}</p>
                    )}
                    {result.retry_suggested && (
                      <button
                        onClick={handleSubmit}
                        className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                      >
                        Try Again
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Help/Instructions */}
            {!result && !isGenerating && (
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-orange-400 mb-3">How It Works</h3>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-start space-x-3">
                    <span className="text-orange-400 font-bold">1.</span>
                    <p>Fill in your episode details, characters, and locations</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-orange-400 font-bold">2.</span>
                    <p>Click "Generate Episode" to start AI image creation</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-orange-400 font-bold">3.</span>
                    <p>Wait 3-5 minutes for professional HD images</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-orange-400 font-bold">4.</span>
                    <p>Download individual images or view them here</p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded">
                  <p className="text-blue-300 text-xs">
                    💡 <strong>Tip:</strong> Each episode generates 4-6 professional images including a thumbnail, character portraits, and location shots. All images are HD quality (1024x1024) optimized for documentary use.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}