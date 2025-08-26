// tiger-web/pages/index.js - Complete Tiger Platform with Beautiful Colors
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Camera, Video, Edit3, Zap, Target, Mic, Image, Settings, Brain, Shield, Plus } from 'lucide-react';

// API Service Functions - These call your backend
const API_BASE_URL = 'http://localhost:8000/api'; // Your tiger-api server

const apiService = {
  // Script API calls
  async generateScript(data) {
    const response = await fetch(`${API_BASE_URL}/script/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  async getUserScripts() {
    const response = await fetch(`${API_BASE_URL}/script/list`);
    return response.json();
  },
  
  // Image API calls
  async generateImage(data) {
    const response = await fetch(`${API_BASE_URL}/image/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  async downloadImage(imageId) {
    const response = await fetch(`${API_BASE_URL}/image/${imageId}/download`);
    return response.blob();
  },
  
  async addPolaroidBorder(imageId, style) {
    const response = await fetch(`${API_BASE_URL}/image/${imageId}/polaroid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ style })
    });
    return response.json();
  },
  
  async getUserImages() {
    const response = await fetch(`${API_BASE_URL}/image/gallery`);
    return response.json();
  }
};

// Beautiful Curved Tabs Component with Vibrant Colors
const CurvedTabs = ({ activeTab, onTabChange, tabs }) => {
  const [hoveredTab, setHoveredTab] = useState(null);

  return (
    <div className="relative">
      {/* Tab Container with Beautiful Gradient */}
      <div className="flex items-end px-4 pt-2 overflow-x-auto" style={{
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
      }}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const isHovered = hoveredTab === tab.id;
          
          return (
            <div
              key={tab.id}
              className="relative flex-shrink-0"
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
            >
              <div
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative px-6 py-3 cursor-pointer transition-all duration-200 ease-out
                  ${isActive || isHovered ? 'transform translate-y-0' : 'transform translate-y-1'}
                `}
                style={{
                  background: isActive 
                    ? 'white'
                    : isHovered
                      ? 'rgba(255, 255, 255, 0.8)'
                      : '#ffffff',
                  color: isActive 
                    ? '#667eea'
                    : isHovered
                      ? '#5a67d8'
                      : '#2d3748',
                  clipPath: isActive 
                    ? 'polygon(15px 100%, 0% 0%, calc(100% - 15px) 0%, 100% 100%)'
                    : 'polygon(10px 100%, 0% 15px, calc(100% - 10px) 15px, 100% 100%)',
                  marginLeft: index > 0 ? '-8px' : '0',
                  paddingLeft: index > 0 ? '20px' : '16px',
                  minWidth: '140px',
                  borderTopLeftRadius: '12px',
                  borderTopRightRadius: '12px',
                  boxShadow: isActive ? '0 4px 12px rgba(102, 126, 234, 0.2)' : 'none'
                }}
              >
                <div className="flex items-center space-x-2 relative z-10">
                  <tab.icon 
                    size={16} 
                    className={`${isActive ? 'text-purple-600' : 'text-gray-600'}`}
                  />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {tab.label}
                  </span>
                </div>

                {isActive && (
                  <div 
                    className="absolute inset-0 opacity-20 rounded-t-xl"
                    style={{
                      background: 'linear-gradient(to top, rgba(102, 126, 234, 0.3), transparent)',
                      clipPath: 'polygon(15px 100%, 0% 0%, calc(100% - 15px) 0%, 100% 100%)'
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}

        <div 
          className="flex-shrink-0 ml-2 p-3 text-white/70 hover:text-white hover:bg-white/20 rounded-t-lg cursor-pointer transition-all duration-200"
          onClick={() => console.log('Add new tab')}
        >
          <Plus size={16} />
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="bg-white border-t-0 rounded-b-xl shadow-sm min-h-96">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`p-6 ${activeTab === tab.id ? 'block' : 'hidden'}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('script');
  
  // State for API data
  const [scripts, setScripts] = useState([]);
  const [images, setImages] = useState([]);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [scriptContent, setScriptContent] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simulate loading - replace with real API calls when backend is ready
        setTimeout(() => {
          setUser({ id: 'user123', name: 'Tiger User' });
          setScripts([
            { id: '1', title: 'Sample Script 1', wordCount: 150, estimatedDuration: '2 min' },
            { id: '2', title: 'Sample Script 2', wordCount: 200, estimatedDuration: '3 min' }
          ]);
          setImages([
            { id: '1', url: 'https://via.placeholder.com/300', prompt: 'Sample image 1' },
            { id: '2', url: 'https://via.placeholder.com/300', prompt: 'Sample image 2' }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Handler functions that call your backend APIs
  const handleGenerateScript = async () => {
    if (!scriptContent.trim()) return;
    
    setIsGeneratingScript(true);
    try {
      // Simulate API call - replace with real apiService call when backend is ready
      setTimeout(() => {
        const newScript = {
          id: Date.now().toString(),
          title: `Generated Script ${scripts.length + 1}`,
          content: scriptContent,
          wordCount: scriptContent.split(' ').length,
          estimatedDuration: `${Math.ceil(scriptContent.split(' ').length / 100)} min`
        };
        setScripts([newScript, ...scripts]);
        setScriptContent('');
        setIsGeneratingScript(false);
        alert('Script generated successfully!');
      }, 2000);
    } catch (error) {
      console.error('Failed to generate script:', error);
      alert('Failed to generate script. Please try again.');
      setIsGeneratingScript(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    
    setIsGeneratingImage(true);
    try {
      // Simulate API call - replace with real apiService call when backend is ready
      setTimeout(() => {
        const newImage = {
          id: Date.now().toString(),
          url: 'https://via.placeholder.com/300',
          prompt: imagePrompt
        };
        setImages([newImage, ...images]);
        setImagePrompt('');
        setIsGeneratingImage(false);
        alert('Image generated successfully!');
      }, 3000);
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('Failed to generate image. Please try again.');
      setIsGeneratingImage(false);
    }
  };

  const handleDownloadImage = async (imageId) => {
    alert(`Downloading image ${imageId}...`);
  };

  const handleAddPolaroid = async (imageId) => {
    alert(`Adding polaroid border to image ${imageId}...`);
  };

  // Tiger Platform Tabs Configuration with Beautiful Styling
  const tigerTabs = [
    {
      id: 'script',
      label: 'Script Studio',
      icon: Edit3,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gradient-primary">📝 Script Generation & Audio Reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border feature-card" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
              <h3 className="text-lg font-semibold mb-3 text-white">Generate Audio Script</h3>
              <textarea 
                value={scriptContent}
                onChange={(e) => setScriptContent(e.target.value)}
                className="w-full h-32 p-4 border border-white/20 rounded-lg resize-none focus:ring-2 focus:ring-white/50 focus:border-transparent bg-white/10 text-white placeholder-white/70"
                placeholder="Enter your content idea for audio reading..."
              />
              <div className="flex space-x-2 mt-4">
                <button 
                  onClick={handleGenerateScript}
                  disabled={isGeneratingScript || !scriptContent.trim()}
                  className="btn-primary text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                  style={{
                    background: isGeneratingScript ? '#4a5568' : 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  {isGeneratingScript ? '🔄 Generating...' : '🎯 Generate Script'}
                </button>
              </div>
            </div>
            <div className="p-6 rounded-xl border feature-card" style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
            }}>
              <h3 className="text-lg font-semibold mb-3 text-white">Script Library ({scripts.length})</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {scripts.length > 0 ? scripts.map((script, index) => (
                  <div key={script.id || index} className="p-3 bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-all">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm text-white">{script.title || `Script ${index + 1}`}</span>
                      <span className="text-xs text-white bg-white/20 px-2 py-1 rounded">Audio Ready</span>
                    </div>
                    <p className="text-xs text-white/80 mt-1">{script.wordCount || 0} words • {script.estimatedDuration || '2 min'} read</p>
                  </div>
                )) : (
                  <div className="text-center text-white/80 py-4">
                    <p>No scripts yet. Generate your first script!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'image',
      label: 'Image Studio',
      icon: Image,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gradient-secondary">📸 Image Generation & Effects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border feature-card" style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
            }}>
              <h3 className="text-lg font-semibold mb-3 text-white">Generate Images</h3>
              <input 
                type="text" 
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                className="w-full p-3 border border-white/20 rounded-lg mb-4 focus:ring-2 focus:ring-white/50 focus:border-transparent bg-white/10 text-white placeholder-white/70" 
                placeholder="Describe your image..."
              />
              <button 
                onClick={handleGenerateImage}
                disabled={isGeneratingImage || !imagePrompt.trim()}
                className="w-full text-white px-6 py-2 rounded-lg transition-all disabled:opacity-50"
                style={{
                  background: isGeneratingImage ? '#4a5568' : 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {isGeneratingImage ? '🔄 Creating...' : '🎨 Create Image'}
              </button>
            </div>
            <div className="p-6 rounded-xl border feature-card" style={{
              background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)'
            }}>
              <h3 className="text-lg font-semibold mb-3 text-white">Polaroid Effects</h3>
              <p className="text-sm text-white/80 mb-4">Click any image below to add polaroid border</p>
              <div className="text-center text-white/70">
                📷 Select an image first
              </div>
            </div>
            <div className="p-6 rounded-xl border feature-card" style={{
              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
            }}>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Download Images</h3>
              <p className="text-sm text-gray-700 mb-4">Gallery ({images.length} images)</p>
              <button 
                onClick={() => alert('Batch download coming soon!')}
                className="w-full text-white px-6 py-2 rounded-lg transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                💾 Download All
              </button>
            </div>
          </div>
          
          {/* Image Gallery */}
          {images.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 feature-card">
              <h3 className="text-lg font-semibold mb-4">Your Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={image.id || index} className="relative group">
                    <img 
                      src={image.url} 
                      alt={image.prompt || `Generated image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-slate-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => handleDownloadImage(image.id)}
                        className="bg-white text-black px-3 py-1 rounded text-sm hover:bg-gray-100"
                      >
                        📥 Download
                      </button>
                      <button 
                        onClick={() => handleAddPolaroid(image.id)}
                        className="bg-white text-black px-3 py-1 rounded text-sm hover:bg-gray-100"
                      >
                        📷 Polaroid
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'video',
      label: 'Video Studio',
      icon: Video,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gradient-primary">🎬 Video Generation</h2>
          <div className="p-8 rounded-xl border feature-card" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}>
            <h3 className="text-xl font-semibold mb-4 text-white">Create Video from Script</h3>
            <p className="text-white/90 mb-6">Transform your audio-optimized scripts into engaging videos.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 p-4 rounded-lg border border-white/20 backdrop-blur-sm">
                <label className="block text-sm font-medium text-white/90 mb-2">Select Script</label>
                <select className="w-full p-2 border border-white/20 rounded focus:ring-2 focus:ring-white/50 focus:border-transparent bg-white/10 text-white">
                  <option value="" className="text-gray-800">Choose a script...</option>
                  {scripts.map((script, index) => (
                    <option key={script.id || index} value={script.id} className="text-gray-800">
                      {script.title || `Script ${index + 1}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-white/10 p-4 rounded-lg border border-white/20 backdrop-blur-sm">
                <label className="block text-sm font-medium text-white/90 mb-2">Video Style</label>
                <select className="w-full p-2 border border-white/20 rounded focus:ring-2 focus:ring-white/50 focus:border-transparent bg-white/10 text-white">
                  <option className="text-gray-800">Documentary</option>
                  <option className="text-gray-800">Modern</option>
                  <option className="text-gray-800">Vintage</option>
                </select>
              </div>
            </div>
            <button 
              onClick={() => alert('Video generation will be implemented with your backend!')}
              className="text-white px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              style={{
                background: 'linear-gradient(90deg, #ff6b6b 0%, #ffa726 100%)'
              }}
            >
              🎥 Generate Video
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'ai',
      label: 'AI Coach',
      icon: Brain,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gradient-primary">🧠 AI Coaching & Optimization</h2>
          <div className="p-6 rounded-xl border feature-card" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}>
            <h3 className="text-lg font-semibold mb-3 text-white">Prompt Optimization</h3>
            <p className="text-white/90 mb-4">Get AI-powered suggestions to improve your content and prompts</p>
            <div className="space-y-4">
              <textarea 
                className="w-full h-24 p-4 border border-white/20 rounded-lg resize-none focus:ring-2 focus:ring-white/50 focus:border-transparent bg-white/10 text-white placeholder-white/70"
                placeholder="Enter your content prompt for optimization..."
              />
              <button className="text-white px-6 py-2 rounded-lg transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                🚀 Optimize Prompt
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'compliance',
      label: 'Legal Shield',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gradient-secondary">🛡️ Legal Compliance</h2>
          <div className="p-6 rounded-xl border feature-card" style={{
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
          }}>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Content Verification</h3>
            <p className="text-gray-700 mb-4">Ensure your content meets legal requirements and platform guidelines</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/50 rounded border backdrop-blur-sm">
                <span className="text-sm text-gray-800">Copyright Check</span>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">✓ Passed</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/50 rounded border backdrop-blur-sm">
                <span className="text-sm text-gray-800">Platform Guidelines</span>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">✓ Compliant</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gradient-primary">⚙️ Platform Settings</h2>
          <div className="p-6 rounded-xl border feature-card" style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
          }}>
            <h3 className="text-lg font-semibold mb-3 text-white">Account Configuration</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Display Name</label>
                <input type="text" className="w-full p-2 border border-white/20 rounded focus:ring-2 focus:ring-white/50 focus:border-transparent bg-white/10 text-white placeholder-white/70" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Email</label>
                <input type="email" className="w-full p-2 border border-white/20 rounded focus:ring-2 focus:ring-white/50 focus:border-transparent bg-white/10 text-white placeholder-white/70" placeholder="your@email.com" />
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Tiger Platform - Loading...</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        
        <div className="min-h-screen flex items-center justify-center" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #ff9a9e 100%)'
        }}>
          <div className="text-center max-w-md mx-auto px-4">
            <div className="mb-8">
              <div className="text-8xl mb-4 animate-bounce">🐅</div>
              <div className="w-32 h-1 mx-auto rounded-full" style={{
                background: 'linear-gradient(90deg, #667eea, #764ba2)'
              }}></div>
            </div>
            
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-16 w-16 mx-auto" style={{
                border: '4px solid rgba(255, 255, 255, 0.2)',
                borderTop: '4px solid white'
              }}></div>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">Tiger Platform</h1>
            <p className="text-lg text-white/90 mb-4">AI-Powered Content Creation</p>
            <p className="text-sm text-white/70 animate-pulse">
              Initializing AI services and content creation tools...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Tiger Platform - AI Content Creation Suite</title>
        <meta name="description" content="Transform your content ideas into professional videos with AI-powered script generation, image creation, and legal compliance tools." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #ff9a9e 100%)'
      }}>
        {/* Beautiful Gradient Header */}
        <header className="sticky top-0 z-50" style={{
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #ff6b6b 100%)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="text-2xl mr-2">🐅</div>
                <h1 className="text-xl font-bold text-white">
                  Tiger Platform
                </h1>
                <span className="ml-2 px-2 py-1 bg-white/20 text-white text-xs font-medium rounded-full">
                  v2.0
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-white/90">Welcome, {user.name}</span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
                      background: 'linear-gradient(135deg, #ffa726 0%, #ff5722 100%)'
                    }}>
                      <span className="text-white text-sm font-medium">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <button className="text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200" style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              🐅 Welcome to Tiger Platform
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Your complete AI-powered content creation suite. Generate scripts for audio reading, 
              create stunning images with polaroid effects, and build professional videos—all in one platform.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-xl border feature-card" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
              <div className="text-3xl mb-3">📝</div>
              <h3 className="text-lg font-semibold text-white mb-2">Audio-Ready Scripts</h3>
              <p className="text-white/80 text-sm">Generate, display, and save scripts optimized for audio reading with perfect pacing and timing.</p>
            </div>
            
            <div className="p-6 rounded-xl border feature-card" style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
            }}>
              <div className="text-3xl mb-3">📸</div>
              <h3 className="text-lg font-semibold text-white mb-2">Image Magic</h3>
              <p className="text-white/80 text-sm">Create stunning visuals and apply vintage polaroid borders. Download individually or in batches.</p>
            </div>
            
            <div className="p-6 rounded-xl border feature-card" style={{
              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
            }}>
              <div className="text-3xl mb-3">🎬</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Video Production</h3>
              <p className="text-gray-700 text-sm">Transform your scripts and images into professional videos with AI-powered automation.</p>
            </div>
          </div>

          {/* Curved Tabs Component */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <CurvedTabs 
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabs={tigerTabs}
            />
          </div>

          {/* Footer */}
          <footer className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 text-white/70 text-sm">
              <span>🐅</span>
              <span>Tiger Platform</span>
              <span>•</span>
              <span>AI-Powered Content Creation</span>
              <span>•</span>
              <span>{new Date().getFullYear()}</span>
            </div>
            <p className="text-xs text-white/50 mt-2">
              Built with Next.js, Tailwind CSS, and powered by OpenAI & Anthropic
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}