import React, { useState } from 'react';
import Head from 'next/head';

export default function TigerTrueCrimeProduction() {
  const [formData, setFormData] = useState({
    caseTitle: '',
    crimeCategory: 'serial-killers',
    timePeriod: '1990s',
    contentType: 'listicle',
    episodeLength: 12,
    contentRating: 'mature',
    narrativeTone: 'investigative',
    researchDepth: 'detailed',
    imageStyle: 'documentary',
    imagesPerSegment: 2,
    includePolaroids: true,
    characters: [{ name: '', role: 'victim', description: '' }],
    locations: [{ name: '', significance: 'crime-scene', description: '' }],
    platforms: ['youtube']
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [progressTime, setProgressTime] = useState('0:00');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const crimeCategories = [
    { value: 'serial-killers', label: '🔪 Serial Killers' },
    { value: 'mass-murder', label: '💀 Mass Murder' },
    { value: 'domestic-violence', label: '🏠 Domestic Violence' },
    { value: 'cold-cases', label: '❄️ Cold Cases' },
    { value: 'white-collar', label: '💼 White Collar Crime' },
    { value: 'organized-crime', label: '🕴️ Organized Crime' },
    { value: 'cult-cases', label: '🕯️ Cult Cases' },
    { value: 'kidnapping', label: '👥 Kidnapping' },
    { value: 'murder-mystery', label: '🔍 Murder Mystery' },
    { value: 'heists', label: '💰 Heists & Robberies' },
    { value: 'forensic-breakthroughs', label: '🧬 Forensic Breakthroughs' },
    { value: 'false-convictions', label: '⚖️ False Convictions' },
    { value: 'police-corruption', label: '👮 Police Corruption' }
  ];

  const timePeriods = [
    { value: '1920s', label: '1920s - Prohibition Era' },
    { value: '1930s', label: '1930s - Great Depression' },
    { value: '1940s', label: '1940s - World War II Era' },
    { value: '1950s', label: '1950s - Post-War America' },
    { value: '1960s', label: '1960s - Civil Rights Era' },
    { value: '1970s', label: '1970s - Cultural Revolution' },
    { value: '1980s', label: '1980s - Reagan Era' },
    { value: '1990s', label: '1990s - Digital Dawn' },
    { value: '2000s', label: '2000s - New Millennium' },
    { value: '2010s', label: '2010s - Social Media Age' },
    { value: '2020s', label: '2020s - Modern Day' }
  ];

  const contentTypes = [
    { value: 'listicle', label: '📝 Listicle Episodes ("X Shocking Facts About...")' },
    { value: 'documentary', label: '🎬 Documentary Style' },
    { value: 'investigation', label: '🔍 Investigation Report' },
    { value: 'character-study', label: '👤 Character Study' },
    { value: 'timeline', label: '📅 Timeline Format' }
  ];

  const characterRoles = [
    { value: 'victim', label: '😢 Victim' },
    { value: 'perpetrator', label: '🔴 Perpetrator' },
    { value: 'detective', label: '🕵️ Detective' },
    { value: 'witness', label: '👁️ Witness' },
    { value: 'family', label: '👨‍👩‍👧‍👦 Family Member' },
    { value: 'expert', label: '🔬 Expert' },
    { value: 'journalist', label: '📰 Journalist' },
    { value: 'judge', label: '⚖️ Judge' },
    { value: 'lawyer', label: '👩‍💼 Lawyer' },
    { value: 'police', label: '👮 Police Officer' },
    { value: 'medical', label: '🏥 Medical Examiner' },
    { value: 'other', label: '👤 Other' }
  ];

  const locationTypes = [
    { value: 'crime-scene', label: '🚨 Crime Scene' },
    { value: 'residence', label: '🏠 Residence' },
    { value: 'investigation-site', label: '🔍 Investigation Site' },
    { value: 'courthouse', label: '🏛️ Courthouse' },
    { value: 'prison', label: '🔒 Prison' },
    { value: 'hospital', label: '🏥 Hospital' },
    { value: 'workplace', label: '🏢 School/Workplace' },
    { value: 'public-space', label: '🌆 Public Space' },
    { value: 'evidence-location', label: '📋 Evidence Location' },
    { value: 'burial-site', label: '⚱️ Burial Site' },
    { value: 'other', label: '📍 Other Location' }
  ];

  const imageStyles = [
    { value: 'documentary', label: '📷 Documentary Photography' },
    { value: 'vintage', label: '📼 Vintage/Period Accurate' },
    { value: 'modern', label: '🔬 Modern Forensic Style' },
    { value: 'artistic', label: '🎨 Artistic/Cinematic' },
    { value: 'polaroid', label: '📸 Polaroid Evidence Style' },
    { value: 'news', label: '📺 News Report Style' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(''); // Clear errors when user types
  };

  const addCharacter = () => {
    if (formData.characters.length < 5) { // Limit to 5 characters
      setFormData(prev => ({
        ...prev,
        characters: [...prev.characters, { name: '', role: 'victim', description: '' }]
      }));
    }
  };

  const updateCharacter = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      characters: prev.characters.map((char, i) => 
        i === index ? { ...char, [field]: value } : char
      )
    }));
  };

  const removeCharacter = (index) => {
    if (formData.characters.length > 1) {
      setFormData(prev => ({
        ...prev,
        characters: prev.characters.filter((_, i) => i !== index)
      }));
    }
  };

  const addLocation = () => {
    if (formData.locations.length < 4) { // Limit to 4 locations
      setFormData(prev => ({
        ...prev,
        locations: [...prev.locations, { name: '', significance: 'crime-scene', description: '' }]
      }));
    }
  };

  const updateLocation = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.map((loc, i) => 
        i === index ? { ...loc, [field]: value } : loc
      )
    }));
  };

  const removeLocation = (index) => {
    if (formData.locations.length > 1) {
      setFormData(prev => ({
        ...prev,
        locations: prev.locations.filter((_, i) => i !== index)
      }));
    }
  };

  const estimatedSegments = Math.ceil(formData.episodeLength * 1.5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.caseTitle.trim()) {
      setError('Case title is required');
      return;
    }

    setIsGenerating(true);
    setShowProgress(true);
    setShowResults(false);
    setError('');
    setProgress(0);
    setProgressStatus('Initializing AI research systems...');

    // Start progress animation
    let currentProgress = 0;
    let stageIndex = 0;
    const stages = [
      'Analyzing case parameters...',
      'Researching crime category and historical context...',
      'Processing characters and locations...',
      'Generating narrative structure...',
      'Creating DALL-E 3 image prompts...',
      'Generating documentary images...',
      'Processing polaroid evidence images...',
      'Optimizing content for production...',
      'Finalizing episode package...'
    ];
    const startTime = Date.now();

    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 6 + 2; // Slower, more realistic progress
      if (currentProgress > 85) currentProgress = 85; // Stop at 85% until real completion

      setProgress(currentProgress);
      
      // Update timer
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      setProgressTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);

      // Update stage
      const expectedStage = Math.floor((currentProgress / 100) * stages.length);
      if (expectedStage < stages.length && expectedStage !== stageIndex) {
        stageIndex = expectedStage;
        setProgressStatus(stages[stageIndex]);
      }
    }, 800); // Slower updates for realistic feel

    try {
      // Call the enhanced AI API with all form data
      const response = await fetch('http://localhost:3001/api/truecrime-production', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          generateScript: true,
          generateImages: true,
          researchMode: true // Enable AI research
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      // Complete progress
      clearInterval(progressInterval);
      setProgress(100);
      setProgressStatus('Production package complete!');

      // Process results for display
      const productionResults = {
        script: data.data.script || null,
        images: data.data.images || [],
        polaroids: data.data.polaroids || [],
        research: data.data.research || null,
        metadata: {
          generationTime: data.generationTimeMs,
          timestamp: data.timestamp,
          segmentCount: estimatedSegments,
          totalImages: (data.data.images?.length || 0) + (data.data.polaroids?.length || 0)
        }
      };

      setTimeout(() => {
        setResults(productionResults);
        setShowResults(true);
        setIsGenerating(false);
        setShowProgress(false);
      }, 1500);

    } catch (error) {
      console.error('Production generation error:', error);
      clearInterval(progressInterval);
      setError(error.message || 'Generation failed. Please try again.');
      setIsGenerating(false);
      setShowProgress(false);
    }
  };

  return (
    <>
      <Head>
        <title>🐅 Tiger True Crime Production Studio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              🐅 Tiger True Crime Production Studio
            </h1>
            <p className="text-gray-300 text-lg">AI-Powered Research & Content Generation for Your Channel</p>
            <div className="mt-2 flex justify-center space-x-4 text-sm text-gray-400">
              <span>• GPT-4 Research Engine</span>
              <span>• DALL-E 3 Image Generation</span>
              <span>• Polaroid Evidence Style</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <div className="bg-gray-800 rounded-lg p-6 space-y-6">
                  
                  {/* Case Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      📖 Case Title or Topic
                    </label>
                    <input
                      type="text"
                      value={formData.caseTitle}
                      onChange={(e) => handleInputChange('caseTitle', e.target.value)}
                      placeholder="Enter case title, criminal name, or topic to research..."
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      AI will research this topic and generate comprehensive content
                    </p>
                  </div>

                  {/* Crime Category & Time Period */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        🏷️ Crime Category
                      </label>
                      <select
                        value={formData.crimeCategory}
                        onChange={(e) => handleInputChange('crimeCategory', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                      >
                        {crimeCategories.map(category => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        📅 Time Period
                      </label>
                      <select
                        value={formData.timePeriod}
                        onChange={(e) => handleInputChange('timePeriod', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                      >
                        {timePeriods.map(period => (
                          <option key={period.value} value={period.value}>
                            {period.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Content Type & Episode Length */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        🎥 Content Format
                      </label>
                      <select
                        value={formData.contentType}
                        onChange={(e) => handleInputChange('contentType', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                      >
                        {contentTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        ⏱️ Episode Length: {formData.episodeLength} minutes
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="25"
                        value={formData.episodeLength}
                        onChange={(e) => handleInputChange('episodeLength', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        Approximately {estimatedSegments} segments
                      </div>
                    </div>
                  </div>

                  {/* Characters Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium text-gray-300">
                        👥 Key Characters (Optional - AI will research if left blank)
                      </label>
                      <button
                        type="button"
                        onClick={addCharacter}
                        disabled={formData.characters.length >= 5}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                      >
                        + Add Character
                      </button>
                    </div>
                    
                    {formData.characters.map((character, index) => (
                      <div key={index} className="bg-gray-700 rounded-lg p-4 mb-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="Character name (optional)"
                            value={character.name}
                            onChange={(e) => updateCharacter(index, 'name', e.target.value)}
                            className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                          />
                          
                          <select
                            value={character.role}
                            onChange={(e) => updateCharacter(index, 'role', e.target.value)}
                            className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:border-red-500"
                          >
                            {characterRoles.map(role => (
                              <option key={role.value} value={role.value}>
                                {role.label}
                              </option>
                            ))}
                          </select>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Brief description (optional)"
                              value={character.description}
                              onChange={(e) => updateCharacter(index, 'description', e.target.value)}
                              className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                            />
                            {formData.characters.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeCharacter(index)}
                                className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Locations Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium text-gray-300">
                        📍 Key Locations (Optional - AI will research if left blank)
                      </label>
                      <button
                        type="button"
                        onClick={addLocation}
                        disabled={formData.locations.length >= 4}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                      >
                        + Add Location
                      </button>
                    </div>
                    
                    {formData.locations.map((location, index) => (
                      <div key={index} className="bg-gray-700 rounded-lg p-4 mb-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="Location name (optional)"
                            value={location.name}
                            onChange={(e) => updateLocation(index, 'name', e.target.value)}
                            className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                          />
                          
                          <select
                            value={location.significance}
                            onChange={(e) => updateLocation(index, 'significance', e.target.value)}
                            className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:border-red-500"
                          >
                            {locationTypes.map(type => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Description (optional)"
                              value={location.description}
                              onChange={(e) => updateLocation(index, 'description', e.target.value)}
                              className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                            />
                            {formData.locations.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeLocation(index)}
                                className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Image Generation Options */}
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">📸 Image Generation Options</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          🎨 Image Style
                        </label>
                        <select
                          value={formData.imageStyle}
                          onChange={(e) => handleInputChange('imageStyle', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-red-500"
                        >
                          {imageStyles.map(style => (
                            <option key={style.value} value={style.value}>
                              {style.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          🔢 Images Per Segment
                        </label>
                        <select
                          value={formData.imagesPerSegment}
                          onChange={(e) => handleInputChange('imagesPerSegment', parseInt(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-red-500"
                        >
                          <option value={1}>1 image per segment</option>
                          <option value={2}>2 images per segment</option>
                          <option value={3}>3 images per segment</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.includePolaroids}
                          onChange={(e) => handleInputChange('includePolaroids', e.target.checked)}
                          className="w-5 h-5 text-red-600 bg-gray-600 border-gray-500 rounded focus:ring-red-500"
                        />
                        <span className="text-gray-300">
                          📸 Generate Polaroid Evidence Style Images (Your Channel Signature)
                        </span>
                      </label>
                      <p className="text-xs text-gray-400 mt-1 ml-8">
                        Creates dual polaroid images: character portrait + crime scene location
                      </p>
                    </div>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
                      <div className="text-red-300">
                        ⚠️ {error}
                      </div>
                    </div>
                  )}

                  {/* Generate Button */}
                  <button
                    type="submit"
                    disabled={!formData.caseTitle.trim() || isGenerating}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-red-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all"
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Researching & Generating Content...</span>
                      </div>
                    ) : (
                      '🚀 Research Topic & Generate Complete Episode Package'
                    )}
                  </button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Production Summary */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">📊 Production Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Episode Length:</span>
                      <span className="text-white">{formData.episodeLength} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Estimated Segments:</span>
                      <span className="text-white">{estimatedSegments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Characters:</span>
                      <span className="text-white">{formData.characters.filter(c => c.name.trim()).length || 'AI Research'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Locations:</span>
                      <span className="text-white">{formData.locations.filter(l => l.name.trim()).length || 'AI Research'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expected Images:</span>
                      <span className="text-white">
                        ~{estimatedSegments * formData.imagesPerSegment}
                        {formData.includePolaroids ? ' + polaroids' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Generation Progress */}
                {showProgress && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">⚡ Generation Progress</h3>
                    <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
                      <div
                        className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-400 text-center mb-2">{progress.toFixed(0)}% Complete</p>
                    <p className="text-xs text-gray-400 text-center">{progressStatus}</p>
                    <p className="text-xs text-gray-500 text-center mt-1">{progressTime}</p>
                  </div>
                )}

                {/* AI Research Features */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">🧠 AI Research Engine</h3>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li>• GPT-4 powered case research</li>
                    <li>• Automatic character identification</li>
                    <li>• Location and timeline analysis</li>
                    <li>• Historical context integration</li>
                    <li>• Narrative structure generation</li>
                    <li>• Evidence-based storytelling</li>
                  </ul>
                </div>

                {/* Quick Tips */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">💡 Production Tips</h3>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li>• Just enter case name - AI does the research</li>
                    <li>• Listicle format works best for engagement</li>
                    <li>• 10-15 minute videos perform best</li>
                    <li>• Polaroid style matches your brand</li>
                    <li>• Documentary images feel authentic</li>
                    <li>• Leave fields blank for full AI research</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>

          {/* Results Section */}
          {showResults && results && (
            <div className="mt-8 bg-gray-800 rounded-lg p-6">
              <h3 className="text-2xl font-bold text-gray-200 mb-6">📺 Generated Episode Package</h3>
              
              {/* Script Section */}
              {results.script && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-300 mb-3">📝 Episode Script</h4>
                  <div className="bg-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap">{results.script}</pre>
                  </div>
                </div>
              )}

              {/* Images Section */}
              {results.images && results.images.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-300 mb-3">
                    📸 Generated Images ({results.images.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.images.map((image, index) => (
                      <div key={index} className="bg-gray-700 rounded-lg overflow-hidden">
                        <div className="aspect-square bg-gray-600 flex items-center justify-center">
                          {image.url ? (
                            <img 
                              src={image.url} 
                              alt={`Generated image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-400">🎬</span>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-gray-400">Segment {index + 1}</p>
                          <p className="text-sm text-gray-300 mt-1">Documentary Style</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Polaroids Section */}
              {results.polaroids && results.polaroids.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-300 mb-3">
                    📸 Polaroid Evidence Style ({results.polaroids.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.polaroids.map((polaroid, index) => (
                      <div key={index} className="bg-gray-700 rounded-lg overflow-hidden">
                        <div className="aspect-square bg-gray-600 flex items-center justify-center">
                          {polaroid.url ? (
                            <img 
                              src={polaroid.url} 
                              alt={`Polaroid evidence ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-400">📸</span>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-gray-400">Polaroid Evidence</p>
                          <p className="text-sm text-gray-300 mt-1">Channel Signature Style</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Generation Metadata */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-300 mb-3">📊 Generation Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Total Images:</span>
                    <span className="text-white ml-2">{results.metadata.totalImages}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Segments:</span>
                    <span className="text-white ml-2">{results.metadata.segmentCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Generation Time:</span>
                    <span className="text-white ml-2">{Math.round(results.metadata.generationTime / 1000)}s</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Ready for:</span>
                    <span className="text-green-400 ml-2">Production</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}