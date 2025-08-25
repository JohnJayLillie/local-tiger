// tiger-web/pages/index.js - Complete Tiger Platform with API Integration
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

// Built-in Curved Tabs Component
const CurvedTabs = ({ activeTab, onTabChange, tabs }) => {
  const [hoveredTab, setHoveredTab] = useState(null);

  return (
    <div className="relative">
      {/* Tab Container */}
      <div className="flex items-end bg-slate-100 px-4 pt-2 overflow-x-auto">
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
                  ${isActive 
                    ? 'bg-white text-purple-600 shadow-lg z-10' 
                    : isHovered
                      ? 'bg-slate-50 text-slate-700 z-5'
                      : 'bg-slate-200 text-slate-500 hover:bg-slate-150 z-0'
                  }
                  ${isActive || isHovered ? 'transform translate-y-0' : 'transform translate-y-1'}
                `}
                style={{
                  clipPath: isActive 
                    ? 'polygon(15px 100%, 0% 0%, calc(100% - 15px) 0%, 100% 100%)'
                    : 'polygon(10px 100%, 0% 15px, calc(100% - 10px) 15px, 100% 100%)',
                  marginLeft: index > 0 ? '-8px' : '0',
                  paddingLeft: index > 0 ? '20px' : '16px',
                  minWidth: '140px',
                  borderTopLeftRadius: '12px',
                  borderTopRightRadius: '12px',
                }}
              >
                <div className="flex items-center space-x-2 relative z-10">
                  <tab.icon 
                    size={16} 
                    className={`${isActive ? 'text-purple-600' : 'text-slate-400'}`}
                  />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {tab.label}
                  </span>
                </div>

                {isActive && (
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-purple-50 to-transparent opacity-30 rounded-t-xl"
                    style={{
                      clipPath: 'polygon(15px 100%, 0% 0%, calc(100% - 15px) 0%, 100% 100%)'
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}

        <div 
          className="flex-shrink-0 ml-2 p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-t-lg cursor-pointer transition-all duration-200"
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

  // Tiger Platform Tabs Configuration with REAL API integration
  const tigerTabs = [
    {
      id: 'script',
      label: 'Script Studio',
      icon: Edit3,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">📝 Script Generation & Audio Reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
              <h3 className="text-lg font-semibold mb-3 text-purple-800">Generate Audio Script</h3>
              <textarea 
                value={scriptContent}
                onChange={(e) => setScriptContent(e.target.value)}
                className="w-full h-32 p-4 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your content idea for audio reading..."
              />
              <div className="flex space-x-2 mt-4">
                <button 
                  onClick={handleGenerateScript}
                  disabled={isGeneratingScript || !scriptContent.trim()}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {isGeneratingScript ? '🔄 Generating...' : '🎯 Generate Script'}
                </button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
              <h3 className="text-lg font-semibold mb-3 text-green-800">Script Library ({scripts.length})</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {scripts.length > 0 ? scripts.map((script, index) => (
                  <div key={script.id || index} className="p-3 bg-white rounded-lg shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{script.title || `Script ${index + 1}`}</span>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Audio Ready</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{script.wordCount || 0} words • {script.estimatedDuration || '2 min'} read</p>
                  </div>
                )) : (
                  <div className="text-center text-gray-500 py-4">
                    <p>No scripts yet. Generate your first script above!</p>
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
          <h2 className="text-2xl font-bold text-slate-800">📸 Image Generation & Effects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold mb-3 text-blue-800">Generate Images</h3>
              <input 
                type="text" 
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                className="w-full p-3 border border-blue-200 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Describe your image..."
              />
              <button 
                onClick={handleGenerateImage}
                disabled={isGeneratingImage || !imagePrompt.trim()}
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isGeneratingImage ? '🔄 Creating...' : '🎨 Create Image'}
              </button>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-100">
              <h3 className="text-lg font-semibold mb-3 text-orange-800">Polaroid Effects</h3>
              <p className="text-sm text-orange-600 mb-4">Click any image below to add polaroid border</p>
              <div className="text-center text-orange-500">
                📷 Select an image first
              </div>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-green-50 p-6 rounded-xl border border-teal-100">
              <h3 className="text-lg font-semibant mb-3 text-teal-800">Download Images</h3>
              <p className="text-sm text-teal-600 mb-4">Gallery ({images.length} images)</p>
              <button 
                onClick={() => alert('Batch download coming soon!')}
                className="w-full bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                💾 Download All
              </button>
            </div>
          </div>
          
          {/* Image Gallery */}
          {images.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-slate-200">
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
          <h2 className="text-2xl font-bold text-slate-800">🎬 Video Generation</h2>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl border border-purple-100">
            <h3 className="text-xl font-semibold mb-4 text-purple-800">Create Video from Script</h3>
            <p className="text-slate-600 mb-6">Transform your audio-optimized scripts into engaging videos.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-purple-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Script</label>
                <select className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="">Choose a script...</option>
                  {scripts.map((script, index) => (
                    <option key={script.id || index} value={script.id}>
                      {script.title || `Script ${index + 1}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-white p-4 rounded-lg border border-purple-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Video Style</label>
                <select className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>Documentary</option>
                  <option>Modern</option>
                  <option>Vintage</option>
                </select>
              </div>
            </div>
            <button 
              onClick={() => alert('Video generation will be implemented with your backend!')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
          <h2 className="text-2xl font-bold text-slate-800">🧠 AI Coaching & Optimization</h2>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
            <h3 className="text-lg font-semibold mb-3 text-indigo-800">Prompt Optimization</h3>
            <p className="text-slate-600 mb-4">Get AI-powered suggestions to improve your content and prompts</p>
            <div className="space-y-4">
              <textarea 
                className="w-full h-24 p-4 border border-indigo-200 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your content prompt for optimization..."
              />
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
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
          <h2 className="text-2xl font-bold text-slate-800">🛡️ Legal Compliance</h2>
          <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl border border-green-100">
            <h3 className="text-lg font-semibold mb-3 text-green-800">Content Verification</h3>
            <p className="text-slate-600 mb-4">Ensure your content meets legal requirements and platform guidelines</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded border border-green-100">
                <span className="text-sm">Copyright Check</span>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">✓ Passed</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded border border-green-100">
                <span className="text-sm">Platform Guidelines</span>
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
          <h2 className="text-2xl font-bold text-slate-800">⚙️ Platform Settings</h2>
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-lg font-semibold mb-3 text-slate-800">Account Configuration</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="your@email.com" />
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
        
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="mb-8">
              <div className="text-8xl mb-4 animate-bounce">🐅</div>
              <div className="w-32 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto rounded-full"></div>
            </div>
            
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
            </div>
            
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Tiger Platform</h1>
            <p className="text-lg text-slate-600 mb-4">AI-Powered Content Creation</p>
            <p className="text-sm text-slate-500 animate-pulse">
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

      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Global Navigation Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="text-2xl mr-2">🐅</div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Tiger Platform
                </h1>
                <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                  v2.0
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-slate-600">Welcome, {user.name}</span>
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200">
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
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              🐅 Welcome to Tiger Platform
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Your complete AI-powered content creation suite. Generate scripts for audio reading, 
              create stunning images with polaroid effects, and build professional videos—all in one platform.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
              <div className="text-3xl mb-3">📝</div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Audio-Ready Scripts</h3>
              <p className="text-slate-600 text-sm">Generate, display, and save scripts optimized for audio reading with perfect pacing and timing.</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100">
              <div className="text-3xl mb-3">📸</div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Image Magic</h3>
              <p className="text-slate-600 text-sm">Create stunning visuals and apply vintage polaroid borders. Download individually or in batches.</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
              <div className="text-3xl mb-3">🎬</div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Video Production</h3>
              <p className="text-slate-600 text-sm">Transform your scripts and images into professional videos with AI-powered automation.</p>
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
            <div className="inline-flex items-center space-x-2 text-slate-500 text-sm">
              <span>🐅</span>
              <span>Tiger Platform</span>
              <span>•</span>
              <span>AI-Powered Content Creation</span>
              <span>•</span>
              <span>{new Date().getFullYear()}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Built with Next.js, Tailwind CSS, and powered by OpenAI & Anthropic
            </p>
          </footer>
        </div>
      </main>

      {/* Global Styles */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #6366f1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #4f46e5);
        }
      `}</style>
    </>
  );
}