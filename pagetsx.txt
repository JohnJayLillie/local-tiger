'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Video, Zap, Target, Mic, Image, Play, BarChart3, Crown, Sparkles, Brain, Shield, Smartphone, Home } from 'lucide-react';

// Main Tiger Web Interface
const TigerApp = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [isMobileView, setIsMobileView] = useState(false);
  const [user] = useState({
    name: 'Alex Creator',
    tier: 'Creator Pro',
    videos: 47,
    totalViews: '2.3M',
    revenue: '$1,247'
  });

  const tabs = [
    { id: 'create', label: 'Create', icon: Video },
    { id: 'prompts', label: 'AI Assistant', icon: Brain },
    { id: 'discover', label: 'Content Discovery', icon: Shield },
    { id: 'images', label: 'Image Studio', icon: Image },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'mobile', label: 'Mobile Preview', icon: Smartphone }
  ];

  // Check for mobile view in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mobile') === 'true') {
      setIsMobileView(true);
    }
  }, []);

  if (isMobileView) {
    return <MobileOnlyInterface />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🐅</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Tiger
              </h1>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                DEMO
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMobileView(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">Mobile View</span>
              </button>
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                <div className="text-xs text-blue-600 flex items-center">
                  <Crown className="w-3 h-3 mr-1" />
                  {user.tier}
                </div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">🚀 Tiger Interactive Demo</h2>
            <p className="text-blue-100 mb-4">Experience the future of AI-powered content creation</p>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">Script-to-Video Automation</span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">AI Prompt Coaching</span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">Legal Compliance Engine</span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">Mobile-First Workflow</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Videos Created" value={user.videos} icon={Video} color="blue" />
          <StatCard title="Total Views" value={user.totalViews} icon={Play} color="green" />
          <StatCard title="Revenue Generated" value={user.revenue} icon={Target} color="purple" />
          <StatCard title="AI Quality Score" value="94%" icon={Sparkles} color="orange" />
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm min-h-[600px]">
          {activeTab === 'create' && <CreateVideoTab />}
          {activeTab === 'prompts' && <PromptAssistantTab />}
          {activeTab === 'discover' && <ContentDiscoveryTab />}
          {activeTab === 'images' && <ImageStudioTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'mobile' && <MobilePreviewTab />}
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Content Creation?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join the waitlist for early access to Tiger&apos;s revolutionary AI-powered content creation platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Join Beta Waitlist
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

// Create Video Tab
const CreateVideoTab = () => {
  const [script, setScript] = useState('Create an engaging video about AI tools that help content creators save time and increase productivity...');
  const [platform, setPlatform] = useState('youtube');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Script to Video Generator</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Zap className="w-4 h-4 text-orange-500" />
          <span>AI-Powered Automation</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform Target</label>
            <div className="flex space-x-3">
              {['youtube', 'tiktok', 'instagram'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                    platform === p
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Video Script</label>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Write your video script here... Tiger will automatically optimize it for AI video generation."
              className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
              <span>{script.length} characters</span>
              <button className="text-blue-600 hover:text-blue-800 flex items-center">
                <Mic className="w-4 h-4 mr-1" />
                Voice Input
              </button>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!script.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating Video...
              </>
            ) : (
              <>
                <Video className="w-5 h-5 mr-2" />
                Generate Video
              </>
            )}
          </button>
        </div>

        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center aspect-video flex flex-col items-center justify-center">
            <Video className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-600 mb-2">Video Preview</p>
            <p className="text-sm text-gray-500">Generated video will appear here</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">🚀 AI Features Active</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Script optimization for {platform}</li>
              <li>• Automatic scene segmentation</li>
              <li>• Smart visual suggestions</li>
              <li>• SEO title generation</li>
              <li>• Thumbnail concepts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Prompt Assistant Tab
const PromptAssistantTab = () => {
  const [prompt, setPrompt] = useState('You are a viral YouTube scriptwriter. Create a 60-second educational video script about AI prompt engineering that hooks viewers in first 5 seconds, teaches 3 key techniques, and ends with strong subscribe CTA. Target: content creators. Tone: conversational but authoritative.');
  const [framework, setFramework] = useState('RACE');
  const [qualityScore, setQualityScore] = useState(0);

  useEffect(() => {
    const score = Math.min(100, prompt.length * 0.8 + Math.random() * 20);
    setQualityScore(Math.round(score));
  }, [prompt]);

  const frameworks = [
    { name: 'RACE', description: 'Role, Action, Constraints, Expected Output' },
    { name: 'SCOPE', description: 'Specific, Context, Output, Persona, Examples' },
    { name: 'VIRAL', description: 'Hook, Value, Emotion, Action' },
    { name: 'EDUCATE', description: 'Question, Explanation, Example, Application' }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">AI Prompt Engineering Assistant</h2>
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-500" />
          <span className="text-sm text-gray-600">Real-time Quality Scoring</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Prompt Framework</label>
            <div className="grid grid-cols-2 gap-3">
              {frameworks.map((f) => (
                <button
                  key={f.name}
                  onClick={() => setFramework(f.name)}
                  className={`p-3 text-left border rounded-lg transition-all ${
                    framework === f.name
                      ? 'border-purple-300 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{f.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{f.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Build your prompt using the ${framework} framework...`}
              className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="bg-gray-50 border rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">💡 AI Suggestions</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Excellent role definition and clear action verb</li>
              <li>• Strong specificity with target audience and timing</li>
              <li>• Consider adding examples for even better results</li>
              <li>• Perfect tone specification for content creators</li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">{qualityScore}%</div>
            <div className="text-sm text-gray-600 mb-4">Prompt Quality Score</div>
            <div className={`w-full h-3 rounded-full ${
              qualityScore >= 80 ? 'bg-green-200' : qualityScore >= 60 ? 'bg-yellow-200' : 'bg-red-200'
            }`}>
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  qualityScore >= 80 ? 'bg-green-500' : qualityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${qualityScore}%` }}
              ></div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {qualityScore >= 90 ? 'Excellent!' : qualityScore >= 80 ? 'Very Good' : qualityScore >= 60 ? 'Good' : 'Needs Improvement'}
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-medium text-purple-900 mb-2">🎯 {framework} Framework</h3>
            {framework === 'RACE' && (
              <div className="text-sm text-purple-800 space-y-2">
                <div><strong>Role:</strong> Set AI persona</div>
                <div><strong>Action:</strong> Define specific task</div>
                <div><strong>Constraints:</strong> Add rules & limitations</div>
                <div><strong>Expected:</strong> Specify output format</div>
              </div>
            )}
            {framework === 'VIRAL' && (
              <div className="text-sm text-purple-800 space-y-2">
                <div><strong>Hook:</strong> Attention grabber</div>
                <div><strong>Value:</strong> Core benefit/insight</div>
                <div><strong>Emotion:</strong> Emotional trigger</div>
                <div><strong>Action:</strong> Clear call-to-action</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Content Discovery Tab
const ContentDiscoveryTab = () => {
  const [searchQuery, setSearchQuery] = useState('law enforcement operations');
  const [sources, setSources] = useState(['fbi', 'usms', 'ice']);

  const federalSources = [
    { id: 'fbi', name: 'FBI Multimedia', count: '2,340 images', compliance: '100%' },
    { id: 'usms', name: 'US Marshals', count: '890 images', compliance: '98%' },
    { id: 'ice', name: 'ICE Operations', count: '1,560 images', compliance: '95%' },
    { id: 'nara', name: 'National Archives', count: '5,670 images', compliance: '92%' }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Legal-Compliant Content Discovery</h2>
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-green-500" />
          <span className="text-sm text-gray-600">100% Public Domain</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Federal Sources</h3>
          {federalSources.map((source) => (
            <label key={source.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={sources.includes(source.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSources([...sources, source.id]);
                  } else {
                    setSources(sources.filter(s => s !== source.id));
                  }
                }}
                className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <div className="flex-1">
                <div className="font-medium text-sm">{source.name}</div>
                <div className="text-xs text-gray-500">{source.count}</div>
                <div className="text-xs text-green-600">✓ {source.compliance} Compliant</div>
              </div>
            </label>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div>
            <div className="flex space-x-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for legal-compliant images..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Search
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <Image className="w-8 h-8 text-gray-400" />
                </div>
                <div className="p-3">
                  <div className="text-sm font-medium text-gray-900">Federal Image {i}</div>
                  <div className="text-xs text-gray-500">FBI Multimedia</div>
                  <div className="text-xs text-green-600 mt-1">✓ Public Domain</div>
                  <button className="w-full mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors">
                    Use Image
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">🛡️ Legal Protection Features</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• All images verified 100% public domain</li>
              <li>• Complete provenance tracking for every asset</li>
              <li>• Automatic compliance validation by state</li>
              <li>• Real-time legal safety scoring</li>
              <li>• Federal source integration (FBI, USMS, ICE, NARA)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Image Studio Tab  
const ImageStudioTab = () => {
  const [prompt, setPrompt] = useState('Professional business meeting in modern office with diverse team collaborating');
  const [preset, setPreset] = useState('youtube-thumbnail');

  const presets = [
    { id: 'youtube-thumbnail', name: 'YouTube Thumbnail', size: '1792x1024', desc: 'Eye-catching, high-engagement' },
    { id: 'tiktok-vertical', name: 'TikTok Vertical', size: '1024x1792', desc: 'Mobile-optimized vertical' },
    { id: 'instagram-square', name: 'Instagram Square', size: '1024x1024', desc: 'Perfect square format' },
    { id: 'business-professional', name: 'Business Professional', size: '1024x1024', desc: 'Corporate-ready imagery' }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">DALL-E Image Studio</h2>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span className="text-sm text-gray-600">AI-Powered Image Generation</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Creator Presets</label>
            <div className="grid grid-cols-2 gap-3">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPreset(p.id)}
                  className={`p-4 text-left border rounded-lg transition-all ${
                    preset === p.id
                      ? 'border-purple-300 bg-purple-50 text-purple-700 ring-2 ring-purple-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-sm">{p.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{p.size}</div>
                  <div className="text-xs text-gray-600 mt-1">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image Description</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create..."
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
            <div className="mt-2 text-sm text-gray-500">
              Tiger will automatically optimize your prompt for DALL-E with professional styling, lighting, and composition.
            </div>
          </div>

          <button
            disabled={!prompt.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            <Image className="w-5 h-5 mr-2" />
            Generate Professional Images
          </button>
        </div>

        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center aspect-square flex flex-col items-center justify-center">
            <Image className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-600 mb-2">Generated Image Preview</p>
            <p className="text-sm text-gray-500">Professional {preset.replace('-', ' ')} will appear here</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-medium text-purple-900 mb-2">✨ Smart Features</h3>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Structured dropdown interface (no complex prompting)</li>
              <li>• Platform-optimized sizing and ratios</li>
              <li>• Professional quality prompt engineering</li>
              <li>• Script-to-image auto-suggestions</li>
              <li>• Creator-specific presets and templates</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">🎯 Current Settings</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <div>Format: <strong>{presets.find(p => p.id === preset)?.name}</strong></div>
              <div>Size: <strong>{presets.find(p => p.id === preset)?.size}</strong></div>
              <div>Style: <strong>Professional Photography</strong></div>
              <div>Quality: <strong>High Resolution</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Analytics Tab
const AnalyticsTab = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Creator Analytics Dashboard</h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200">7D</button>
          <button className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded">30D</button>
          <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200">90D</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
          <div className="text-3xl font-bold">47</div>
          <div className="text-blue-100">Videos Created</div>
          <div className="text-sm text-blue-200 mt-1">+12 this month</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
          <div className="text-3xl font-bold">2.3M</div>
          <div className="text-green-100">Total Views</div>
          <div className="text-sm text-green-200 mt-1">+25% growth</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
          <div className="text-3xl font-bold">94%</div>
          <div className="text-purple-100">Avg Quality Score</div>
          <div className="text-sm text-purple-200 mt-1">Industry leading</div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
          <div className="text-3xl font-bold">$1,247</div>
          <div className="text-orange-100">Revenue Generated</div>
          <div className="text-sm text-orange-200 mt-1">+$340 this month</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 border rounded-lg p-6">
          <h3 className="font-medium text-gray-900 mb-4">📊 AI Performance Insights</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Videos using AI prompts perform 34% better</span>
              <span className="text-sm font-medium text-green-600">+34%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Legal-compliant content reduces risk by 100%</span>
              <span className="text-sm font-medium text-green-600">100%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Mobile workflow saves 2.5 hours per video</span>
              <span className="text-sm font-medium text-blue-600">-2.5hr</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">DALL-E thumbnails increase CTR by 45%</span>
              <span className="text-sm font-medium text-purple-600">+45%</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-4">🚀 Tiger Advantage</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-blue-800">75% cost savings vs competitors</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-blue-800">Only platform with prompt coaching</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-blue-800">100% legal compliance guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-blue-800">Mobile-first creator workflow</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mobile Preview Tab
const MobilePreviewTab = () => {
  const [activeScreen, setActiveScreen] = useState('home');

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Mobile App Preview</h2>
        <div className="flex items-center space-x-2">
          <Smartphone className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-gray-600">Native iOS & Android</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex justify-center">
          <div className="w-72 h-[600px] bg-black rounded-[3rem] p-2 shadow-2xl">
            <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
              <div className="h-6 bg-gray-900 flex items-center justify-between px-6 text-white text-xs">
                <span>9:41</span>
                <span className="text-center">Tiger Demo</span>
                <div className="flex space-x-1">
                  <div className="w-4 h-2 bg-white rounded-sm"></div>
                  <div className="w-1 h-2 bg-white rounded-sm"></div>
                </div>
              </div>

              <div className="flex-1 bg-gradient-to-br from-orange-50 to-red-50 h-[calc(100%-88px)]">
                <MobileMockup activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
              </div>

              <div className="h-16 bg-white border-t border-gray-200 flex items-center justify-around">
                {[
                  { id: 'home', icon: Home, label: 'Home' },
                  { id: 'voice', icon: Mic, label: 'Voice' },
                  { id: 'camera', icon: Camera, label: 'Camera' },
                  { id: 'create', icon: Video, label: 'Create' }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveScreen(item.id)}
                      className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                        activeScreen === item.id ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs mt-1">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Screen Navigation</h3>
            <div className="space-y-2">
              {[
                { id: 'home', name: 'Home Dashboard' },
                { id: 'voice', name: 'Voice Recording' },
                { id: 'camera', name: 'Camera Capture' },
                { id: 'create', name: 'Video Creation' }
              ].map((screen) => (
                <button
                  key={screen.id}
                  onClick={() => setActiveScreen(screen.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    activeScreen === screen.id
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  {screen.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">📱 Mobile Features</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Voice-to-script while driving</li>
              <li>• Camera-based inspiration capture</li>
              <li>• Offline content creation mode</li>
              <li>• Real-time cross-platform sync</li>
              <li>• Location-aware content suggestions</li>
              <li>• Push notifications for trending topics</li>
            </ul>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="font-medium text-orange-900 mb-2">🚀 Competitive Edge</h3>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Only true mobile-first creator platform</li>
              <li>• Voice workflow unique to Tiger</li>
              <li>• Native app performance & UX</li>
              <li>• Creator-specific design language</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mobile Mockup Component
interface MobileMockupProps {
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
}

const MobileMockup = ({ activeScreen, setActiveScreen }: MobileMockupProps) => {
  switch (activeScreen) {
    case 'home':
      return (
        <div className="p-4 h-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold flex items-center">
                🐅 <span className="ml-2">Tiger</span>
              </h1>
              <p className="text-sm text-gray-600">Good morning, Creator!</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-blue-100 p-4 rounded-xl">
              <div className="text-2xl font-bold text-blue-700">47</div>
              <div className="text-xs text-blue-600">Videos Created</div>
            </div>
            <div className="bg-green-100 p-4 rounded-xl">
              <div className="text-2xl font-bold text-green-700">2.3M</div>
              <div className="text-xs text-green-600">Total Views</div>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => setActiveScreen('create')}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-xl font-medium flex items-center justify-center"
            >
              <Video className="w-5 h-5 mr-2" />
              Quick Create Video
            </button>
            <button 
              onClick={() => setActiveScreen('voice')}
              className="w-full bg-gray-100 text-gray-700 p-4 rounded-xl flex items-center justify-center"
            >
              <Mic className="w-5 h-5 mr-2" />
              Voice to Script
            </button>
            <button 
              onClick={() => setActiveScreen('camera')}
              className="w-full bg-gray-100 text-gray-700 p-4 rounded-xl flex items-center justify-center"
            >
              <Camera className="w-5 h-5 mr-2" />
              Capture Inspiration
            </button>
          </div>
        </div>
      );

    case 'voice':
      return (
        <div className="p-4 h-full flex flex-col items-center justify-center">
          <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Mic className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-3">Voice Recording Active</h2>
          <p className="text-sm text-gray-600 text-center mb-6 px-4">
            &quot;Create a video about the best AI tools for content creators in 2024...&quot;
          </p>
          <div className="w-full max-w-xs bg-gray-200 rounded-full h-3 mb-6">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 h-3 rounded-full w-1/3 animate-pulse"></div>
          </div>
          <button className="bg-red-500 text-white px-8 py-3 rounded-xl font-medium">
            Stop Recording
          </button>
        </div>
      );

    case 'camera':
      return (
        <div className="h-full bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="w-20 h-20 text-white opacity-30" />
          </div>
          <div className="absolute top-4 left-4 right-4">
            <div className="bg-black bg-opacity-70 text-white p-3 rounded-xl text-sm">
              📸 Capture visual inspiration for your next video
            </div>
          </div>
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <button className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            </button>
          </div>
        </div>
      );

    case 'create':
      return (
        <div className="p-4 h-full">
          <h2 className="text-xl font-bold mb-4">Create Video</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
              <div className="grid grid-cols-3 gap-2">
                <button className="bg-red-100 text-red-700 p-3 rounded-lg text-sm font-medium">
                  YouTube
                </button>
                <button className="bg-gray-100 text-gray-700 p-3 rounded-lg text-sm">
                  TikTok
                </button>
                <button className="bg-gray-100 text-gray-700 p-3 rounded-lg text-sm">
                  Instagram
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Script</label>
              <textarea
                placeholder="Write your script or use voice input..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm resize-none"
                defaultValue="Create an engaging video about AI tools that help content creators save time..."
              />
            </div>

            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-xl font-medium flex items-center justify-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Generate with AI
            </button>
          </div>
        </div>
      );

    default:
      return null;
  }
};

// Mobile-Only Interface
const MobileOnlyInterface = () => {
  const [activeScreen, setActiveScreen] = useState('home');

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm h-[700px] bg-black rounded-[3rem] p-2 shadow-2xl">
        <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
          <div className="h-6 bg-gray-900 flex items-center justify-between px-6 text-white text-xs">
            <span>9:41</span>
            <span className="text-center">Tiger Mobile Demo</span>
            <div className="flex space-x-1">
              <div className="w-4 h-2 bg-white rounded-sm"></div>
              <div className="w-1 h-2 bg-white rounded-sm"></div>
            </div>
          </div>

          <div className="flex-1 bg-gradient-to-br from-orange-50 to-red-50 h-[calc(100%-88px)]">
            <MobileMockup activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
          </div>

          <div className="h-16 bg-white border-t border-gray-200 flex items-center justify-around">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'voice', icon: Mic, label: 'Voice' },
              { id: 'camera', icon: Camera, label: 'Camera' },
              { id: 'create', icon: Video, label: 'Create' }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveScreen(item.id)}
                  className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                    activeScreen === item.id ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      <button
        onClick={() => window.location.href = window.location.href.replace('?mobile=true', '')}
        className="absolute top-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
      >
        ← Desktop View
      </button>
    </div>
  );
};

export default TigerApp;