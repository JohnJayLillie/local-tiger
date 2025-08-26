// src/screens/AICoach.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';

interface OptimizationResult {
  id: string;
  originalPrompt: string;
  optimizedPrompt: string;
  improvements: string[];
  score: number;
  timestamp: Date;
}

interface CoachingTip {
  id: string;
  category: string;
  title: string;
  description: string;
  example: string;
}

const coachingTips: CoachingTip[] = [
  {
    id: '1',
    category: 'Clarity',
    title: 'Be Specific',
    description: 'Use precise language and avoid vague terms',
    example: 'Instead of "make it good", try "make it professional and engaging"'
  },
  {
    id: '2',
    category: 'Structure',
    title: 'Add Context',
    description: 'Provide background information for better results',
    example: 'Include target audience, tone, and desired outcome'
  },
  {
    id: '3',
    category: 'Format',
    title: 'Specify Format',
    description: 'Tell the AI exactly what format you want',
    example: 'Request "bullet points", "paragraph form", or "step-by-step"'
  },
  {
    id: '4',
    category: 'Engagement',
    title: 'Use Action Words',
    description: 'Start with strong verbs to drive results',
    example: 'Begin with "Create", "Generate", "Analyze", or "Explain"'
  },
];

export default function AICoach() {
  const [promptText, setPromptText] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activeTab, setActiveTab] = useState<'optimize' | 'tips' | 'history'>('optimize');
  const [optimizations, setOptimizations] = useState<OptimizationResult[]>([
    {
      id: '1',
      originalPrompt: 'Write a blog post about AI',
      optimizedPrompt: 'Create a 500-word informative blog post about artificial intelligence for small business owners, focusing on practical applications and benefits. Use a professional yet approachable tone with subheadings and bullet points.',
      improvements: ['Added target audience', 'Specified word count', 'Clarified tone', 'Requested structure'],
      score: 85,
      timestamp: new Date(Date.now() - 86400000)
    }
  ]);

  const handleOptimizePrompt = async () => {
    if (!promptText.trim()) return;
    
    setIsOptimizing(true);
    
    // Simulate AI optimization
    setTimeout(() => {
      const improvements = [
        'Added specific context and audience',
        'Enhanced clarity with precise language',
        'Included desired format and structure',
        'Improved actionability'
      ];
      
      const optimizedPrompt = enhancePrompt(promptText);
      const score = Math.floor(Math.random() * 20) + 80; // 80-100 range
      
      const newOptimization: OptimizationResult = {
        id: Date.now().toString(),
        originalPrompt: promptText,
        optimizedPrompt,
        improvements,
        score,
        timestamp: new Date()
      };
      
      setOptimizations([newOptimization, ...optimizations]);
      setPromptText('');
      setIsOptimizing(false);
      setActiveTab('history');
      
      Alert.alert('Optimization Complete', `Your prompt has been improved! Score: ${score}/100`);
    }, 2500);
  };

  const enhancePrompt = (original: string): string => {
    // Simple prompt enhancement logic
    const enhancements = [
      `Create a comprehensive ${original.toLowerCase()}`,
      'for your target audience',
      'using a professional and engaging tone.',
      'Structure the content with clear headings and bullet points.',
      'Include actionable insights and practical examples.'
    ];
    
    return enhancements.join(' ');
  };

  const copyToClipboard = (text: string) => {
    Alert.alert('Copied', 'Optimized prompt copied to clipboard!');
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981'; // Green
    if (score >= 75) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const renderOptimizeTab = () => (
    <View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Prompt Optimization</Text>
        <Text style={styles.cardSubtitle}>
          Get AI-powered suggestions to improve your content prompts
        </Text>
        
        <TextInput
          style={styles.textArea}
          value={promptText}
          onChangeText={setPromptText}
          placeholder="Enter your content prompt for optimization..."
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        
        <TouchableOpacity
          style={[styles.button, (isOptimizing || !promptText.trim()) && styles.buttonDisabled]}
          onPress={handleOptimizePrompt}
          disabled={isOptimizing || !promptText.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {isOptimizing ? '🔄 Analyzing & Optimizing...' : '🚀 Optimize Prompt'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Tips</Text>
        <View style={styles.tipsGrid}>
          {coachingTips.slice(0, 2).map((tip) => (
            <View key={tip.id} style={styles.tipBox}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDescription}>{tip.description}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderTipsTab = () => (
    <View>
      {coachingTips.map((tip) => (
        <View key={tip.id} style={styles.card}>
          <View style={styles.tipHeader}>
            <Text style={styles.tipCategory}>{tip.category}</Text>
            <Text style={styles.cardTitle}>{tip.title}</Text>
          </View>
          <Text style={styles.tipFullDescription}>{tip.description}</Text>
          <View style={styles.exampleBox}>
            <Text style={styles.exampleLabel}>Example:</Text>
            <Text style={styles.exampleText}>{tip.example}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderHistoryTab = () => (
    <View>
      {optimizations.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No optimizations yet. Try optimizing a prompt first!
          </Text>
        </View>
      ) : (
        optimizations.map((optimization) => (
          <View key={optimization.id} style={styles.card}>
            <View style={styles.optimizationHeader}>
              <View style={styles.scoreContainer}>
                <Text style={[styles.scoreText, { color: getScoreColor(optimization.score) }]}>
                  {optimization.score}/100
                </Text>
                <Text style={styles.scoreLabel}>Quality Score</Text>
              </View>
              <Text style={styles.timestamp}>
                {optimization.timestamp.toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.promptSection}>
              <Text style={styles.sectionTitle}>Original Prompt:</Text>
              <Text style={styles.originalPrompt}>{optimization.originalPrompt}</Text>
            </View>
            
            <View style={styles.promptSection}>
              <Text style={styles.sectionTitle}>Optimized Prompt:</Text>
              <Text style={styles.optimizedPrompt}>{optimization.optimizedPrompt}</Text>
              <TouchableOpacity 
                style={styles.copyButton}
                onPress={() => copyToClipboard(optimization.optimizedPrompt)}
              >
                <Text style={styles.copyButtonText}>📋 Copy</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.improvementsSection}>
              <Text style={styles.sectionTitle}>Improvements Made:</Text>
              {optimization.improvements.map((improvement, index) => (
                <Text key={index} style={styles.improvementItem}>
                  • {improvement}
                </Text>
              ))}
            </View>
          </View>
        ))
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🧠 AI Coach</Text>
      <Text style={styles.subtitle}>AI-powered prompt optimization & coaching</Text>

      <View style={styles.tabContainer}>
        {[
          { id: 'optimize', label: 'Optimize' },
          { id: 'tips', label: 'Tips' },
          { id: 'history', label: 'History' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id as any)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'optimize' && renderOptimizeTab()}
        {activeTab === 'tips' && renderTipsTab()}
        {activeTab === 'history' && renderHistoryTab()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  textArea: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    fontSize: 16,
    minHeight: 100,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  tipBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  tipTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    lineHeight: 16,
  },
  tipHeader: {
    marginBottom: 12,
  },
  tipCategory: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  tipFullDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  exampleBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  exampleLabel: {
    color: '#34d399',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  exampleText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
  },
  optimizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scoreLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  timestamp: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  promptSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  originalPrompt: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
  },
  optimizedPrompt: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  copyButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  copyButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  improvementsSection: {
    marginTop: 8,
  },
  improvementItem: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
});