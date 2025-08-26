// src/screens/ScriptStudio.tsx
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

interface Script {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  estimatedDuration: string;
}

export default function ScriptStudio() {
  const [scriptContent, setScriptContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [scripts, setScripts] = useState<Script[]>([
    { id: '1', title: 'Sample Script 1', content: '', wordCount: 150, estimatedDuration: '2 min' },
    { id: '2', title: 'Sample Script 2', content: '', wordCount: 200, estimatedDuration: '3 min' }
  ]);

  const handleGenerateScript = async () => {
    if (!scriptContent.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate API call - replace with real tiger-api call
    setTimeout(() => {
      const newScript: Script = {
        id: Date.now().toString(),
        title: `Generated Script ${scripts.length + 1}`,
        content: scriptContent,
        wordCount: scriptContent.split(' ').length,
        estimatedDuration: `${Math.ceil(scriptContent.split(' ').length / 100)} min`
      };
      
      setScripts([newScript, ...scripts]);
      setScriptContent('');
      setIsGenerating(false);
      Alert.alert('Success', 'Script generated successfully!');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>📝 Script Studio</Text>
        <Text style={styles.subtitle}>Generate & save audio-optimized scripts</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Generate Audio Script</Text>
          <TextInput
            style={styles.textArea}
            value={scriptContent}
            onChangeText={setScriptContent}
            placeholder="Enter your content idea for audio reading..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[styles.button, (isGenerating || !scriptContent.trim()) && styles.buttonDisabled]}
            onPress={handleGenerateScript}
            disabled={isGenerating || !scriptContent.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {isGenerating ? '🔄 Generating...' : '🎯 Generate Script'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Script Library ({scripts.length})</Text>
          {scripts.length > 0 ? (
            scripts.map((script) => (
              <View key={script.id} style={styles.scriptItem}>
                <View style={styles.scriptHeader}>
                  <Text style={styles.scriptTitle}>{script.title}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Audio Ready</Text>
                  </View>
                </View>
                <Text style={styles.scriptMeta}>
                  {script.wordCount} words • {script.estimatedDuration} read
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              No scripts yet. Generate your first script!
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  content: {
    flex: 1,
    padding: 16,
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
    marginBottom: 24,
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
  scriptItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  scriptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scriptTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  scriptMeta: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    padding: 20,
    fontSize: 14,
  },
});