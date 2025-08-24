import { useState } from 'react';
import { Loader2, Download, Clock, CheckCircle, AlertCircle, Trash2, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateEpisode() {
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
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!episodeData.title || episodeData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!episodeData.description || episodeData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
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
        return prev + Math.random() * 15;
      });
    }, 800);
    return interval;
  };

  const handleGenerate = async () => {
    if (!validateForm()) return;
    
    setIsGenerating(true);
    setResult(null);
    setErrors({});
    
    const progressInterval = simulateProgress();
    
    try {
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      const mockResult = {
        success: true,
        episode: {
          id: `ep_${Date.now()}`,
          title: episodeData.title,
          created_at: new Date().toISOString(),
          generation_time: "3.9 minutes",
          metadata: {
            total_images_generated: 6,
            quality: "82/100",
            ai_service: "DALL-E-3",
            characters_count: episodeData.characters.filter(c => c.name).length,
            locations_count: episodeData.locations.filter(l => l.name).length
          },
          images: {
            thumbnail: {
              url: "https://picsum.photos/1024/1024?random=1&blur=1",
              alt: "YouTube thumbnail"
            },
            background: {
              url: "https://picsum.photos/1920/1080?random=2",
              alt: "Master background image"
            },
            characters: episodeData.characters
              .filter(char => char.name.trim())
              .slice(0, 4)
              .map((char, i) => ({
                character_name: char.name,
                url: `https://picsum.photos/1024/1024?random=${i + 10}`,
                alt: `${char.name} portrait`
              })),
            locations: episodeData.locations
              .filter(loc => loc.name.trim())
              .map((loc, i) => ({
                location_name: loc.name,
                url: `https://picsum.photos/1024/1024?random=${i + 20}`,
                alt: `${loc.name} location shot`
              }))
          }
        }
      };
      
      setTimeout(() => {
        setResult(mockResult);
        setIsGenerating(false);
        setGenerationProgress(0);
      }, 1000);
      
    } catch (error) {
      clearInterval(progressInterval);
      setResult({
        success: false,
        error: 'Generation failed. Please try again.'
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

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #000000 100%)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(251, 146, 60, 0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#fb923c',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      padding: '8px 16px',
      borderRadius: '8px',
      border: '1px solid rgba(251, 146, 60, 0.3)',
      transition: 'all 0.2s'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      background: 'linear-gradient(to right, #fb923c, #ef4444)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: 0
    },
    subtitle: {
      color: '#94a3b8',
      fontSize: '14px',
      margin: 0
    },
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 24px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '32px'
    },
    section: {
      background: 'rgba(30, 41, 59, 0.6)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      padding: '32px',
      border: '1px solid rgba(71, 85, 105, 0.5)',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
      marginBottom: '32px'
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#fb923c',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px'
    },
    inputGroup: {
      marginBottom: '24px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#cbd5e1',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '16px',
      borderRadius: '12px',
      background: 'rgba(15, 23, 42, 0.6)',
      border: '2px solid #475569',
      color: 'white',
      fontSize: '16px',
      transition: 'all 0.2s',
      outline: 'none',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '16px',
      borderRadius: '12px',
      background: 'rgba(15, 23, 42, 0.6)',
      border: '2px solid #475569',
      color: 'white',
      fontSize: '16px',
      resize: 'none',
      height: '128px',
      transition: 'all 0.2s',
      outline: 'none',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '16px',
      borderRadius: '12px',
      background: 'rgba(15, 23, 42, 0.6)',
      border: '2px solid #475569',
      color: 'white',
      fontSize: '16px',
      transition: 'all 0.2s',
      outline: 'none',
      boxSizing: 'border-box'
    },
    errorText: {
      color: '#ef4444',
      fontSize: '14px',
      fontWeight: '500',
      marginTop: '4px'
    },
    characterCard: {
      background: 'rgba(15, 23, 42, 0.5)',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid rgba(71, 85, 105, 0.5)',
      marginBottom: '16px'
    },
    button: {
      backgroundColor: '#ea580c',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    primaryButton: {
      width: '100%',
      background: 'linear-gradient(to right, #ea580c, #dc2626)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '20px 32px',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      transition: 'all 0.2s',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
    },
    secondaryButton: {
      width: '100%',
      backgroundColor: '#475569',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    progressContainer: {
      background: 'rgba(30, 41, 59, 0.6)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid rgba(71, 85, 105, 0.5)'
    },
    progressBar: {
      backgroundColor: '#475569',
      borderRadius: '8px',
      height: '16px',
      overflow: 'hidden',
      marginBottom: '12px'
    },
    progressFill: {
      background: 'linear-gradient(to right, #fb923c, #ef4444)',
      height: '100%',
      transition: 'width 1s ease-out',
      width: `${generationProgress}%`
    },
    grid2: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px'
    },
    image: {
      width: '100%',
      maxWidth: '512px',
      borderRadius: '12px',
      border: '2px solid #475569',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
      transition: 'all 0.3s'
    },
    successBox: {
      background: 'rgba(34, 197, 94, 0.2)',
      border: '1px solid rgba(34, 197, 94, 0.5)',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '32px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <Link href="/" style={styles.backButton}>
              <ArrowLeft size={16} />
              Back to Home
            </Link>
            <div>
              <h1 style={styles.title}>🐅 Create Episode</h1>
              <p style={styles.subtitle}>Generate professional true crime content</p>
            </div>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {/* Left Column - Form */}
        <div>
          {/* Episode Details */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <span>📝</span> Episode Details
            </h2>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Episode Title <span style={{color: '#ef4444'}}>*</span>
              </label>
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
                style={{
                  ...styles.input,
                  borderColor: errors.title ? '#ef4444' : '#475569'
                }}
                placeholder="The Missing Heiress"
                maxLength={100}
              />
              {errors.title && (
                <p style={styles.errorText}>{errors.title}</p>
              )}
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Description <span style={{color: '#ef4444'}}>*</span>
              </label>
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
                style={{
                  ...styles.textarea,
                  borderColor: errors.description ? '#ef4444' : '#475569'
                }}
                placeholder="A wealthy socialite vanishes without a trace from her Manhattan penthouse..."
                maxLength={500}
              />
              {errors.description && (
                <p style={styles.errorText}>{errors.description}</p>
              )}
              <p style={{fontSize: '12px', color: '#94a3b8', marginTop: '4px'}}>
                {episodeData.description.length}/500 characters
              </p>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Time Period</label>
              <select
                value={episodeData.time_period}
                onChange={(e) => setEpisodeData({...episodeData, time_period: e.target.value})}
                style={styles.select}
              >
                <option value="1980s">1980s</option>
                <option value="1990s">1990s</option>
                <option value="2000s">2000s</option>
                <option value="2010s">2010s</option>
                <option value="2020s">2020s</option>
              </select>
            </div>
          </section>

          {/* Characters */}
          <section style={styles.section}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h3 style={{...styles.sectionTitle, marginBottom: 0}}>
                <span>👥</span> Characters (Max 4)
              </h3>
              <button
                onClick={addCharacter}
                disabled={episodeData.characters.length >= 4}
                style={{
                  ...styles.button,
                  backgroundColor: episodeData.characters.length >= 4 ? '#475569' : '#ea580c',
                  cursor: episodeData.characters.length >= 4 ? 'not-allowed' : 'pointer'
                }}
              >
                <Plus size={16} />
                Add Character
              </button>
            </div>
            
            {episodeData.characters.map((character, index) => (
              <div key={index} style={styles.characterCard}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                  <span style={{fontWeight: '600', color: '#cbd5e1'}}>Character {index + 1}</span>
                  {episodeData.characters.length > 1 && (
                    <button
                      onClick={() => removeCharacter(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <div style={styles.grid2}>
                  <input
                    type="text"
                    placeholder="Character Name"
                    value={character.name}
                    onChange={(e) => updateCharacter(index, 'name', e.target.value)}
                    style={{...styles.input, padding: '12px'}}
                    maxLength={50}
                  />
                  <input
                    type="text"
                    placeholder="Role"
                    value={character.role}
                    onChange={(e) => updateCharacter(index, 'role', e.target.value)}
                    style={{...styles.input, padding: '12px'}}
                    maxLength={50}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={character.description}
                  onChange={(e) => updateCharacter(index, 'description', e.target.value)}
                  style={{...styles.input, padding: '12px', marginTop: '16px'}}
                  maxLength={100}
                />
              </div>
            ))}
          </section>

          {/* Locations */}
          <section style={styles.section}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h3 style={{...styles.sectionTitle, marginBottom: 0}}>
                <span>📍</span> Locations (Max 3)
              </h3>
              <button
                onClick={addLocation}
                disabled={episodeData.locations.length >= 3}
                style={{
                  ...styles.button,
                  backgroundColor: episodeData.locations.length >= 3 ? '#475569' : '#ea580c',
                  cursor: episodeData.locations.length >= 3 ? 'not-allowed' : 'pointer'
                }}
              >
                <Plus size={16} />
                Add Location
              </button>
            </div>
            
            {episodeData.locations.map((location, index) => (
              <div key={index} style={styles.characterCard}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                  <span style={{fontWeight: '600', color: '#cbd5e1'}}>Location {index + 1}</span>
                  {episodeData.locations.length > 1 && (
                    <button
                      onClick={() => removeLocation(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Location Name"
                  value={location.name}
                  onChange={(e) => updateLocation(index, 'name', e.target.value)}
                  style={{...styles.input, padding: '12px', marginBottom: '16px'}}
                  maxLength={50}
                />
                <input
                  type="text"
                  placeholder="Significance (optional)"
                  value={location.significance}
                  onChange={(e) => updateLocation(index, 'significance', e.target.value)}
                  style={{...styles.input, padding: '12px'}}
                  maxLength={100}
                />
              </div>
            ))}
          </section>

          {/* Action Buttons */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !episodeData.title || !episodeData.description}
              style={{
                ...styles.primaryButton,
                opacity: (isGenerating || !episodeData.title || !episodeData.description) ? 0.5 : 1,
                cursor: (isGenerating || !episodeData.title || !episodeData.description) ? 'not-allowed' : 'pointer'
              }}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Generating Images...</span>
                </>
              ) : (
                <>
                  <span>🎬</span>
                  <span>Generate Episode</span>
                </>
              )}
            </button>
            
            {!isGenerating && (
              <button
                onClick={clearForm}
                style={styles.secondaryButton}
              >
                Clear Form
              </button>
            )}
          </div>

          {/* Progress Bar */}
          {isGenerating && (
            <div style={{...styles.progressContainer, marginTop: '24px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#cbd5e1', marginBottom: '12px'}}>
                <span style={{fontWeight: '500'}}>Generating AI images...</span>
                <span style={{fontWeight: 'bold'}}>{Math.round(generationProgress)}%</span>
              </div>
              <div style={styles.progressBar}>
                <div style={styles.progressFill} />
              </div>
              <p style={{fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', margin: 0}}>
                <Clock size={12} />
                Estimated time: 3.9 minutes
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Results */}
        <div>
          {/* Generation Status */}
          {isGenerating && (
            <div style={styles.section}>
              <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px'}}>
                <Loader2 className="animate-spin" size={32} style={{color: '#fb923c'}} />
                <h2 style={{...styles.sectionTitle, marginBottom: 0}}>Generating Images</h2>
              </div>
              <div style={{color: '#cbd5e1'}}>
                <p style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
                  <Clock size={20} />
                  <span style={{fontWeight: '500'}}>Creating 6 professional assets...</span>
                </p>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px', color: '#94a3b8'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <span style={{color: '#4ade80'}}>✓</span>
                    <span>YouTube thumbnail</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <span style={{color: '#4ade80'}}>✓</span>
                    <span>Master background</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <span style={{color: '#4ade80'}}>✓</span>
                    <span>Character portraits</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <span style={{color: '#4ade80'}}>✓</span>
                    <span>HD 1024x1024 quality</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div style={styles.section}>
              <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px'}}>
                {result.success ? (
                  <CheckCircle size={32} style={{color: '#4ade80'}} />
                ) : (
                  <AlertCircle size={32} style={{color: '#ef4444'}} />
                )}
                <h2 style={{...styles.sectionTitle, marginBottom: 0}}>
                  {result.success ? 'Episode Complete!' : 'Generation Failed'}
                </h2>
              </div>

              {result.success ? (
                <div style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
                  {/* Success Summary */}
                  <div style={styles.successBox}>
                    <p style={{color: '#4ade80', fontWeight: 'bold', fontSize: '18px', marginBottom: '8px', margin: 0}}>
                      ✅ Generated {result.episode.metadata.total_images_generated} professional assets
                    </p>
                    <p style={{color: '#cbd5e1', margin: 0}}>
                      <span style={{fontWeight: '500'}}>Time:</span> {result.episode.generation_time} | 
                      <span style={{fontWeight: '500'}}> Quality:</span> {result.episode.metadata.quality} | 
                      <span style={{fontWeight: '500'}}> AI:</span> {result.episode.metadata.ai_service}
                    </p>
                  </div>

                  {/* YouTube Thumbnail */}
                  {result.episode.images.thumbnail && (
                    <div>
                      <h3 style={{fontWeight: 'bold', marginBottom: '16px', color: '#fb923c', fontSize: '20px'}}>
                        📺 YouTube Thumbnail
                      </h3>
                      <div style={{position: 'relative', marginBottom: '24px'}}>
                        <img 
                          src={result.episode.images.thumbnail.url} 
                          alt="YouTube thumbnail"
                          style={styles.image}
                        />
                        <button
                          onClick={() => downloadImage(
                            result.episode.images.thumbnail.url, 
                            `${result.episode.title.replace(/[^a-zA-Z0-9]/g, '_')}_thumbnail.jpg`
                          )}
                          style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            background: 'rgba(0, 0, 0, 0.8)',
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            padding: '12px',
                            color: 'white',
                            cursor: 'pointer'
                          }}
                        >
                          <Download size={20} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Master Background */}
                  {result.episode.images.background && (
                    <div>
                      <h3 style={{fontWeight: 'bold', marginBottom: '16px', color: '#fb923c', fontSize: '20px'}}>
                        🎨 Master Background
                      </h3>
                      <div style={{position: 'relative', marginBottom: '24px'}}>
                        <img 
                          src={result.episode.images.background.url} 
                          alt="Master background"
                          style={styles.image}
                        />
                        <button
                          onClick={() => downloadImage(
                            result.episode.images.background.url, 
                            `${result.episode.title.replace(/[^a-zA-Z0-9]/g, '_')}_background.jpg`
                          )}
                          style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            background: 'rgba(0, 0, 0, 0.8)',
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            padding: '12px',
                            color: 'white',
                            cursor: 'pointer'
                          }}
                        >
                          <Download size={20} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Character Portraits */}
                  {result.episode.images.characters?.length > 0 && (
                    <div>
                      <h3 style={{fontWeight: 'bold', marginBottom: '16px', color: '#fb923c', fontSize: '20px'}}>
                        👥 Character Portraits
                      </h3>
                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px'}}>
                        {result.episode.images.characters.map((char, i) => (
                          <div key={i}>
                            <p style={{fontWeight: '600', marginBottom: '12px', color: '#cbd5e1'}}>{char.character_name}</p>
                            <div style={{position: 'relative'}}>
                              <img 
                                src={char.url} 
                                alt={char.character_name}
                                style={styles.image}
                              />
                              <button
                                onClick={() => downloadImage(
                                  char.url, 
                                  `${char.character_name.replace(/[^a-zA-Z0-9]/g, '_')}_portrait.jpg`
                                )}
                                style={{
                                  position: 'absolute',
                                  top: '16px',
                                  right: '16px',
                                  background: 'rgba(0, 0, 0, 0.8)',
                                  border: '1px solid #475569',
                                  borderRadius: '8px',
                                  padding: '12px',
                                  color: 'white',
                                  cursor: 'pointer'
                                }}
                              >
                                <Download size={20} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)', borderRadius: '12px', padding: '24px'}}>
                  <p style={{color: '#ef4444', fontWeight: 'bold', fontSize: '18px', margin: '0 0 8px 0'}}>❌ {result.error}</p>
                  <button
                    onClick={handleGenerate}
                    style={{...styles.button, backgroundColor: '#dc2626', marginTop: '16px'}}
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Help Section */}
          {!result && !isGenerating && (
            <div style={{...styles.section, background: 'rgba(30, 41, 59, 0.4)'}}>
              <h3 style={{...styles.sectionTitle}}>
                <span>💡</span> What You'll Get
              </h3>
              <div style={{color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6'}}>
                <p style={{marginBottom: '16px', fontWeight: '500'}}>Each episode generates 6 professional assets:</p>
                <ul style={{margin: 0, paddingLeft: '20px'}}>
                  <li>YouTube thumbnail (1024x1024)</li>
                  <li>Master background image (1920x1080)</li>
                  <li>4 character portraits (1024x1024 each)</li>
                  <li>Documentary-quality "Binge True Crime" style</li>
                  <li>Multi-platform optimization</li>
                  <li>Instant download capability</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}