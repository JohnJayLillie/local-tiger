// tiger-web/components/CurvedTabs.jsx
import React, { useState } from 'react';
import { Camera, Video, Edit3, Zap, Target, Mic, Image, Settings, Brain, Shield, Plus } from 'lucide-react';

// NEW FEATURE: Change Tab appearance to curved appearance like browsers and not square
const CurvedTabs = ({ activeTab, onTabChange, tabs }) => {
  const [hoveredTab, setHoveredTab] = useState(null);

  return (
    <div className="relative">
      {/* Tab Container with curved browser-like appearance */}
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
              {/* Curved Tab Shape */}
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
                {/* Tab Content */}
                <div className="flex items-center space-x-2 relative z-10">
                  <tab.icon 
                    size={16} 
                    className={`${isActive ? 'text-purple-600' : 'text-slate-400'}`}
                  />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {tab.label}
                  </span>
                </div>

                {/* Active Tab Glow Effect */}
                {isActive && (
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-purple-50 to-transparent opacity-30 rounded-t-xl"
                    style={{
                      clipPath: 'polygon(15px 100%, 0% 0%, calc(100% - 15px) 0%, 100% 100%)'
                    }}
                  />
                )}

                {/* Hover Shimmer Effect */}
                {isHovered && !isActive && (
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer rounded-t-xl"
                  />
                )}
              </div>

              {/* Tab Separator (subtle shadow for depth) */}
              {!isActive && index < tabs.length - 1 && (
                <div className="absolute right-0 top-4 bottom-4 w-px bg-slate-300 opacity-30" />
              )}
            </div>
          );
        })}

        {/* Add New Tab Button */}
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

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        /* Custom scrollbar for tab overflow */
        .overflow-x-auto::-webkit-scrollbar {
          height: 4px;
        }
        
        .overflow-x-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        
        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

// Example usage with Tiger Platform tabs
const TigerWithCurvedTabs = () => {
  const [activeTab, setActiveTab] = useState('script');

  const tigerTabs = [
    {
      id: 'script',
      label: 'Script Studio',
      icon: Edit3,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">Script Generation & Audio Reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-3">Generate Script</h3>
              <textarea 
                className="w-full h-32 p-4 border border-slate-200 rounded-lg resize-none"
                placeholder="Enter your content idea..."
              />
              <button className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
                Generate Audio Script
              </button>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-3">Script Library</h3>
              <div className="space-y-2">
                <div className="p-3 bg-white rounded-lg shadow-sm">True Crime Episode 1</div>
                <div className="p-3 bg-white rounded-lg shadow-sm">Documentary Script</div>
                <div className="p-3 bg-white rounded-lg shadow-sm">Podcast Intro</div>
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
          <h2 className="text-2xl font-bold text-slate-800">Image Generation & Effects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-3">Generate Images</h3>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Create Image
              </button>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-3">Polaroid Effects</h3>
              <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700">
                Add Polaroid Border
              </button>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-green-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-3">Download Images</h3>
              <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700">
                Batch Download
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'video',
      label: 'Video Studio',
      icon: Video,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">Video Generation</h2>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-3">Create Video from Script</h3>
            <p className="text-slate-600 mb-4">Transform your audio-optimized scripts into engaging videos</p>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
              Generate Video
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
          <h2 className="text-2xl font-bold text-slate-800">AI Coaching</h2>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-3">Prompt Optimization</h3>
            <p className="text-slate-600">Get AI-powered suggestions to improve your content</p>
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
          <h2 className="text-2xl font-bold text-slate-800">Legal Compliance</h2>
          <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-3">Content Verification</h3>
            <p className="text-slate-600">Ensure your content meets legal requirements</p>
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
          <h2 className="text-2xl font-bold text-slate-800">Platform Settings</h2>
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-3">Account Configuration</h3>
            <p className="text-slate-600">Manage your Tiger Platform preferences</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <h1 className="text-3xl font-bold">🐅 Tiger Platform</h1>
            <p className="text-purple-100 mt-2">AI-Powered Content Creation Suite</p>
          </div>
          
          <CurvedTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tigerTabs}
          />
        </div>
      </div>
    </div>
  );
};

export default TigerWithCurvedTabs;