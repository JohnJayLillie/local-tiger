import React, { useState } from 'react';
import Head from 'next/head';

export default function TigerTrueCrimeProduction() {
  const [formData, setFormData] = useState({
    caseTitle: '',
    crimeCategory: 'serial-killers',
    timePeriod: '1990s',
    contentType: 'listicle',
    episodeLength: 12,
    segmentsPerEpisode: 18,
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
  const [results, setResults] = useState(null);
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
    setError('');
  };

  const addCharacter = () => {
    if (formData.characters.length < 5) {
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
    if (formData.locations.length < 4) {
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

  const estimatedSegments = formData.segmentsPerEpisode || Math.ceil(formData.episodeLength * 1.5);

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
      currentProgress += Math.random() * 6 + 2;
      if (currentProgress > 85) currentProgress = 85;

      setProgress(currentProgress);
      
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      setProgressTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);

      const expectedStage = Math.floor((currentProgress / 100) * stages.length);
      if (expectedStage < stages.length && expectedStage !== stageIndex) {
        stageIndex = expectedStage;
        setProgressStatus(stages[stageIndex]);
      }
    }, 800);

    try {
      const response = await fetch('http://localhost:3001/api/truecrime-production', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          generateScript: true,
          generateImages: true,
          researchMode: true
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      clearInterval(progressInterval);
      setProgress(100);
      setProgressStatus('Production package complete!');

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

      <div style={{ 
        backgroundColor: '#0A0A0A', 
        color: 'white', 
        minHeight: '100vh', 
        overflowY: 'auto',
        position: 'relative',
        width: '100%'
      }}>
        {/* Header */}
        <header style={{ padding: '2rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '3rem' }}>🐅</span>
                <div>
                  <h1 style={{ 
                    fontSize: '2rem', 
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '0.5rem'
                  }}>
                    Tiger AI Production Studio
                  </h1>
                  <p style={{ color: '#9ca3af', fontSize: '1rem' }}>AI-Powered Research & Content Generation</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#4ade80', fontSize: '0.875rem', marginBottom: '0.25rem' }}>● Online</div>
                <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>v2.0.0 Production Ready</div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 2rem 4rem 2rem',
          position: 'relative',
          zIndex: 1
        }}>
          
          {/* Hero Section */}
          <section style={{ textAlign: 'center', padding: '3rem 0' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              <span style={{ color: 'white' }}>AI-Powered </span>
              <span style={{ 
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>True Crime</span>
              <span style={{ color: 'white' }}> Production</span>
            </h2>
            
            <p style={{ fontSize: '1.25rem', color: '#d1d5db', marginBottom: '2rem' }}>
              Complete episode packages with AI research, scripts, and DALL-E 3 images
            </p>

            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: 'center', 
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              {[
                { color: '#60a5fa', text: 'GPT-4 Research Engine' },
                { color: '#4ade80', text: 'DALL-E 3 Image Generation' },
                { color: '#c084fc', text: 'Polaroid Evidence Style' },
                { color: '#fb923c', text: 'Production Ready Scripts' }
              ].map((feature, i) => (
                <div key={i} style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(26, 26, 26, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  backdropFilter: 'blur(10px)'
                }}>
                  <span style={{ color: feature.color }}>●</span> {feature.text}
                </div>
              ))}
            </div>
          </section>

          <form onSubmit={handleSubmit}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '2fr 1fr', 
              gap: '2rem', 
              marginBottom: '2rem', 
              width: '100%', 
              position: 'relative',
              alignItems: 'start'
            }}>
              
              {/* Main Form */}
              <div style={{
                background: 'rgba(26, 26, 26, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '1rem',
                padding: '2rem',
                height: 'auto',
                maxHeight: 'none',
                overflow: 'visible'
              }}>
                
                {/* Case Title */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '1rem', 
                    fontWeight: '600', 
                    marginBottom: '0.5rem',
                    color: '#ffffff'
                  }}>
                    📖 Case Title or Topic to Research
                  </label>
                  <input
                    type="text"
                    value={formData.caseTitle}
                    onChange={(e) => handleInputChange('caseTitle', e.target.value)}
                    placeholder="Enter case title, criminal name, or topic (e.g., 'Ted Bundy', 'Golden State Killer')"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      border: '2px solid #374151',
                      borderRadius: '0.75rem',
                      color: 'white',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                    required
                  />
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                    AI will research this topic and generate comprehensive content
                  </p>
                </div>

                {/* Category and Time Period */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#ffffff' }}>
                      🏷️ Crime Category
                    </label>
                    <select
                      value={formData.crimeCategory}
                      onChange={(e) => handleInputChange('crimeCategory', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        border: '2px solid #374151',
                        borderRadius: '0.5rem',
                        color: 'white',
                        fontSize: '0.875rem'
                      }}
                    >
                      {crimeCategories.map(category => (
                        <option key={category.value} value={category.value} style={{ backgroundColor: '#1f2937' }}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#ffffff' }}>
                      📅 Time Period
                    </label>
                    <select
                      value={formData.timePeriod}
                      onChange={(e) => handleInputChange('timePeriod', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        border: '2px solid #374151',
                        borderRadius: '0.5rem',
                        color: 'white',
                        fontSize: '0.875rem'
                      }}
                    >
                      {timePeriods.map(period => (
                        <option key={period.value} value={period.value} style={{ backgroundColor: '#1f2937' }}>
                          {period.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Content Type and Length */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#ffffff' }}>
                      🎥 Content Format
                    </label>
                    <select
                      value={formData.contentType}
                      onChange={(e) => handleInputChange('contentType', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        border: '2px solid #374151',
                        borderRadius: '0.5rem',
                        color: 'white',
                        fontSize: '0.875rem'
                      }}
                    >
                      {contentTypes.map(type => (
                        <option key={type.value} value={type.value} style={{ backgroundColor: '#1f2937' }}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#ffffff' }}>
                      ⏱️ Episode Length: {formData.episodeLength} minutes
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="25"
                      value={formData.episodeLength}
                      onChange={(e) => handleInputChange('episodeLength', parseInt(e.target.value))}
                      style={{ width: '100%', marginBottom: '0.5rem' }}
                    />
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      Approximately {estimatedSegments} segments
                    </div>
                  </div>
                </div>

                {/* Image Options */}
                <div style={{ 
                  background: 'rgba(0, 0, 0, 0.3)', 
                  borderRadius: '0.75rem', 
                  padding: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#ffffff' }}>
                    📸 Image Generation Options
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#d1d5db' }}>
                        🎨 Image Style
                      </label>
                      <select
                        value={formData.imageStyle}
                        onChange={(e) => handleInputChange('imageStyle', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          border: '1px solid #374151',
                          borderRadius: '0.5rem',
                          color: 'white',
                          fontSize: '0.875rem'
                        }}
                      >
                        {imageStyles.map(style => (
                          <option key={style.value} value={style.value} style={{ backgroundColor: '#1f2937' }}>
                            {style.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#d1d5db' }}>
                        🔢 Images Per Segment
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="4"
                        value={formData.imagesPerSegment}
                        onChange={(e) => handleInputChange('imagesPerSegment', parseInt(e.target.value) || 2)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          border: '1px solid #374151',
                          borderRadius: '0.5rem',
                          color: 'white',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.includePolaroids}
                      onChange={(e) => handleInputChange('includePolaroids', e.target.checked)}
                      style={{ width: '1.25rem', height: '1.25rem' }}
                    />
                    <span style={{ color: '#d1d5db', fontSize: '0.875rem' }}>
                      📸 Generate Polaroid Evidence Style Images (Your Channel Signature)
                    </span>
                  </label>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginLeft: '2rem', marginTop: '0.25rem' }}>
                    Creates dual polaroid images: character portrait + crime scene location
                  </p>
                </div>

                {/* Error Display */}
                {error && (
                  <div style={{ 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    border: '1px solid rgba(239, 68, 68, 0.3)', 
                    borderRadius: '0.5rem', 
                    padding: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <span style={{ color: '#fca5a5' }}>⚠️ {error}</span>
                  </div>
                )}

                {/* Generate Button */}
                <button
                  type="submit"
                  disabled={!formData.caseTitle.trim() || isGenerating}
                  style={{
                    width: '100%',
                    background: !formData.caseTitle.trim() || isGenerating 
                      ? 'rgba(107, 114, 128, 0.5)' 
                      : 'linear-gradient(to right, #dc2626, #ea580c)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.125rem',
                    padding: '1rem 2rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: !formData.caseTitle.trim() || isGenerating ? 'not-allowed' : 'pointer',
                    opacity: !formData.caseTitle.trim() || isGenerating ? 0.6 : 1
                  }}
                >
                  {isGenerating ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <span>🔄</span>
                      <span>Researching & Generating Content...</span>
                    </span>
                  ) : (
                    <span>🚀 Research Topic & Generate Complete Episode Package</span>
                  )}
                </button>
              </div>

              {/* Sidebar */}
              <div style={{ 
                height: 'auto',
                maxHeight: 'none',
                position: 'sticky',
                top: '2rem',
                alignSelf: 'start'
              }}>
                {/* Production Summary */}
                <div style={{
                  background: 'rgba(26, 26, 26, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#ffffff' }}>📊 Production Summary</h3>
                  <div style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ color: '#9ca3af' }}>Episode Length:</span>
                      <span>{formData.episodeLength} min</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ color: '#9ca3af' }}>Estimated Segments:</span>
                      <span>{estimatedSegments}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ color: '#9ca3af' }}>Expected Images:</span>
                      <span>
                        ~{estimatedSegments * formData.imagesPerSegment}
                        {formData.includePolaroids ? ' + polaroids' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Generation Progress */}
                {showProgress && (
                  <div style={{
                    background: 'rgba(26, 26, 26, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    marginBottom: '1.5rem'
                  }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#ffffff' }}>⚡ Generation Progress</h3>
                    <div style={{
                      width: '100%',
                      height: '0.75rem',
                      backgroundColor: '#374151',
                      borderRadius: '9999px',
                      marginBottom: '0.75rem'
                    }}>
                      <div
                        style={{
                          width: `${progress}%`,
                          height: '100%',
                          background: 'linear-gradient(to right, #dc2626, #ea580c)',
                          borderRadius: '9999px',
                          transition: 'width 0.5s ease'
                        }}
                      />
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#d1d5db', textAlign: 'center', marginBottom: '0.5rem' }}>
                      {progress.toFixed(0)}% Complete
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center', marginBottom: '0.25rem' }}>
                      {progressStatus}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'center' }}>
                      {progressTime}
                    </p>
                  </div>
                )}

                {/* Production Tips */}
                <div style={{
                  background: 'rgba(26, 26, 26, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '1rem',
                  padding: '1.5rem'
                }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#ffffff' }}>💡 Production Tips</h3>
                  <ul style={{ fontSize: '0.875rem', color: '#9ca3af', listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '0.5rem' }}>• Just enter case name - AI does the research</li>
                    <li style={{ marginBottom: '0.5rem' }}>• Listicle format works best for engagement</li>
                    <li style={{ marginBottom: '0.5rem' }}>• 10-15 minute videos perform best</li>
                    <li style={{ marginBottom: '0.5rem' }}>• Polaroid style matches your brand</li>
                    <li style={{ marginBottom: '0.5rem' }}>• Documentary images feel authentic</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>

          {/* Results Section */}
          {showResults && results && (
            <section style={{
              background: 'rgba(26, 26, 26, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
              padding: '2rem',
              marginBottom: '3rem'
            }}>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#ffffff' }}>
                📺 Generated Episode Package
              </h3>
              
              {/* Script Section */}
              {results.script && (
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#d1d5db' }}>📝 Episode Script</h4>
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    maxHeight: '24rem',
                    overflowY: 'auto',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <pre style={{ 
                      fontSize: '0.875rem', 
                      color: '#d1d5db', 
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'inherit',
                      margin: 0
                    }}>
                      {results.script}
                    </pre>
                  </div>
                </div>
              )}

              {/* Images Section */}
              {results.images && results.images.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#d1d5db' }}>
                    📸 Generated Images ({results.images.length})
                  </h4>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '1rem' 
                  }}>
                    {results.images.map((image, index) => (
                      <div key={index} style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '0.75rem',
                        overflow: 'hidden',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <div style={{ aspectRatio: '1', backgroundColor: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {image.url ? (
                            <img 
                              src={image.url} 
                              alt={`Generated image ${index + 1}`}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <span style={{ fontSize: '3rem', opacity: 0.5 }}>🎬</span>
                          )}
                        </div>
                        <div style={{ padding: '1rem' }}>
                          <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                            Segment {index + 1}
                          </p>
                          <p style={{ fontSize: '0.875rem', color: '#d1d5db' }}>Documentary Style</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Polaroids Section */}
              {results.polaroids && results.polaroids.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#d1d5db' }}>
                    📸 Polaroid Evidence Style ({results.polaroids.length})
                  </h4>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: '1rem' 
                  }}>
                    {results.polaroids.map((polaroid, index) => (
                      <div key={index} style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '0.75rem',
                        overflow: 'hidden',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <div style={{ aspectRatio: '4/3', backgroundColor: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {polaroid.url ? (
                            <img 
                              src={polaroid.url} 
                              alt={`Polaroid evidence ${index + 1}`}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <span style={{ fontSize: '3rem', opacity: 0.5 }}>📸</span>
                          )}
                        </div>
                        <div style={{ padding: '1rem' }}>
                          <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                            Polaroid Evidence
                          </p>
                          <p style={{ fontSize: '0.875rem', color: '#d1d5db' }}>Channel Signature Style</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Generation Summary */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#d1d5db' }}>📊 Generation Summary</h4>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                  gap: '1rem',
                  fontSize: '0.875rem'
                }}>
                  <div>
                    <span style={{ color: '#9ca3af' }}>Total Images:</span>
                    <span style={{ color: 'white', marginLeft: '0.5rem' }}>{results.metadata.totalImages}</span>
                  </div>
                  <div>
                    <span style={{ color: '#9ca3af' }}>Segments:</span>
                    <span style={{ color: 'white', marginLeft: '0.5rem' }}>{results.metadata.segmentCount}</span>
                  </div>
                  <div>
                    <span style={{ color: '#9ca3af' }}>Generation Time:</span>
                    <span style={{ color: 'white', marginLeft: '0.5rem' }}>{Math.round(results.metadata.generationTime / 1000)}s</span>
                  </div>
                  <div>
                    <span style={{ color: '#9ca3af' }}>Status:</span>
                    <span style={{ color: '#4ade80', marginLeft: '0.5rem' }}>Ready for Production</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Footer */}
          <footer style={{ 
            textAlign: 'center', 
            padding: '2rem 0', 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            marginTop: '2rem'
          }}>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
              Powered by Tiger AI • GPT-4 Research • DALL-E 3 Generation • Production v2.0.0 • 2025
            </p>
          </footer>

        </main>
      </div>
    </>
  );
}