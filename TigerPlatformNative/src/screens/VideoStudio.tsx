// src/screens/VideoStudio.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
  Modal,
} from 'react-native';

interface Script {
  id: string;
  title: string;
  wordCount: number;
  estimatedDuration: string;
}

interface Video {
  id: string;
  title: string;
  scriptId: string;
  style: string;
  format: string;
  duration: string;
  status: 'generating' | 'completed' | 'failed';
  progress: number;
  thumbnailUrl?: string;
}

const videoFormats = [
  { id: 'youtube-long', label: 'YouTube Long-form', icon: '📺', description: '5+ minutes' },
  { id: 'youtube-shorts', label: 'YouTube Shorts', icon: '🎬', description: '60 seconds' },
  { id: 'tiktok', label: 'TikTok Video', icon: '🎵', description: '15-60 seconds' },
  { id: 'instagram-reel', label: 'Instagram Reel', icon: '📱', description: '15-90 seconds' },
];

const videoStyles = [
  { id: 'documentary', label: 'Documentary', icon: '🎥', description: 'Professional narration' },
  { id: 'modern', label: 'Modern', icon: '✨', description: 'Dynamic visuals' },
  { id: 'vintage', label: 'Vintage', icon: '📼', description: 'Classic aesthetic' },
  { id: 'educational', label: 'Educational', icon: '🎓', description: 'Teaching focused' },
];

export default function VideoStudio() {
  const [selectedScript, setSelectedScript] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [showFormatModal, setShowFormatModal] = useState(false);
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Mock data - replace with real data from Script Studio
  const [scripts] = useState<Script[]>([
    { id: '1', title: 'Sample Script 1', wordCount: 150, estimatedDuration: '2 min' },
    { id: '2', title: 'Sample Script 2', wordCount: 200, estimatedDuration: '3 min' },
    { id: '3', title: 'Generated Script 3', wordCount: 180, estimatedDuration: '2.5 min' },
  ]);

  const [videos, setVideos] = useState<Video[]>([
    { 
      id: '1', 
      title: 'Tech Tutorial Video', 
      scriptId: '1', 
      style: 'modern', 
      format: 'youtube-long', 
      duration: '2 min',
      status: 'completed',
      progress: 100,
      thumbnailUrl: 'https://via.placeholder.com/300x180/667eea/ffffff?text=Video+1'
    },
    { 
      id: '2', 
      title: 'Product Demo Short', 
      scriptId: '2', 
      style: 'documentary', 
      format: 'youtube-shorts', 
      duration: '60 sec',
      status: 'generating',
      progress: 65
    },
  ]);

  const getSelectedScriptTitle = () => {
    const script = scripts.find(s => s.id === selectedScript);
    return script ? script.title : 'Choose a script...';
  };

  const getSelectedFormatLabel = () => {
    const format = videoFormats.find(f => f.id === selectedFormat);
    return format ? format.label : 'Select format...';
  };

  const getSelectedStyleLabel = () => {
    const style = videoStyles.find(s => s.id === selectedStyle);
    return style ? style.label : 'Select style...';
  };

  const handleGenerateVideo = async () => {
    if (!selectedScript || !selectedFormat || !selectedStyle) {
      Alert.alert('Missing Information', 'Please select a script, format, and style.');
      return;
    }

    setIsGenerating(true);

    const script = scripts.find(s => s.id === selectedScript);
    const format = videoFormats.find(f => f.id === selectedFormat);
    
    // Simulate video generation
    setTimeout(() => {
      const newVideo: Video = {
        id: Date.now().toString(),
        title: `${script?.title} Video`,
        scriptId: selectedScript,
        style: selectedStyle,
        format: selectedFormat,
        duration: script?.estimatedDuration || '2 min',
        status: 'generating',
        progress: 0
      };
      
      setVideos([newVideo, ...videos]);
      setIsGenerating(false);
      
      // Simulate progress updates
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(progressInterval);
          setVideos(prev => prev.map(v => 
            v.id === newVideo.id 
              ? { ...v, status: 'completed', progress: 100, thumbnailUrl: 'https://via.placeholder.com/300x180/4facfe/ffffff?text=New+Video' }
              : v
          ));
        } else {
          setVideos(prev => prev.map(v => 
            v.id === newVideo.id ? { ...v, progress } : v
          ));
        }
      }, 1000);

      Alert.alert('Video Generation Started', 'Your video is being processed. Check back in a few minutes.');
    }, 1000);
  };

  const handleVideoAction = (video: Video, action: string) => {
    switch (action) {
      case 'download':
        Alert.alert('Download', `Downloading ${video.title}...`);
        break;
      case 'share':
        Alert.alert('Share', `Sharing ${video.title}...`);
        break;
      case 'delete':
        Alert.alert('Delete Video', `Delete ${video.title}?`, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => {
            setVideos(prev => prev.filter(v => v.id !== video.id));
          }}
        ]);
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🎬 Video Studio</Text>
        <Text style={styles.subtitle}>Transform scripts into professional videos</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create New Video</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Select Script</Text>
            <TouchableOpacity 
              style={styles.selector}
              onPress={() => setShowScriptModal(true)}
            >
              <Text style={styles.selectorText}>{getSelectedScriptTitle()}</Text>
              <Text style={styles.selectorArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Format</Text>
              <TouchableOpacity 
                style={styles.selector}
                onPress={() => setShowFormatModal(true)}
              >
                <Text style={styles.selectorTextSmall}>{getSelectedFormatLabel()}</Text>
                <Text style={styles.selectorArrow}>▼</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Style</Text>
              <TouchableOpacity 
                style={styles.selector}
                onPress={() => setShowStyleModal(true)}
              >
                <Text style={styles.selectorTextSmall}>{getSelectedStyleLabel()}</Text>
                <Text style={styles.selectorArrow}>▼</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.generateButton, isGenerating && styles.buttonDisabled]}
            onPress={handleGenerateVideo}
            disabled={isGenerating}
            activeOpacity={0.8}
          >
            <Text style={styles.generateButtonText}>
              {isGenerating ? '🔄 Starting Generation...' : '🎥 Generate Video'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Videos ({videos.length})</Text>
          
          {videos.map((video) => (
            <View key={video.id} style={styles.videoItem}>
              <View style={styles.videoHeader}>
                <Text style={styles.videoTitle}>{video.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: 
                  video.status === 'completed' ? '#10b981' : 
                  video.status === 'generating' ? '#f59e0b' : '#ef4444'
                }]}>
                  <Text style={styles.statusText}>
                    {video.status === 'completed' ? '✓ Ready' : 
                     video.status === 'generating' ? '⏳ Processing' : '❌ Failed'}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.videoMeta}>
                {video.format.replace('-', ' ')} • {video.style} • {video.duration}
              </Text>
              
              {video.status === 'generating' && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${video.progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{Math.round(video.progress)}%</Text>
                </View>
              )}
              
              {video.status === 'completed' && (
                <View style={styles.videoActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleVideoAction(video, 'download')}
                  >
                    <Text style={styles.actionButtonText}>💾 Download</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleVideoAction(video, 'share')}
                  >
                    <Text style={styles.actionButtonText}>📤 Share</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleVideoAction(video, 'delete')}
                  >
                    <Text style={styles.actionButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Script Selection Modal */}
      <Modal visible={showScriptModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Script</Text>
            {scripts.map((script) => (
              <TouchableOpacity
                key={script.id}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedScript(script.id);
                  setShowScriptModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{script.title}</Text>
                <Text style={styles.modalOptionMeta}>{script.wordCount} words • {script.estimatedDuration}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              style={styles.modalClose}
              onPress={() => setShowScriptModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Format Selection Modal */}
      <Modal visible={showFormatModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Format</Text>
            {videoFormats.map((format) => (
              <TouchableOpacity
                key={format.id}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedFormat(format.id);
                  setShowFormatModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{format.icon} {format.label}</Text>
                <Text style={styles.modalOptionMeta}>{format.description}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              style={styles.modalClose}
              onPress={() => setShowFormatModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Style Selection Modal */}
      <Modal visible={showStyleModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Style</Text>
            {videoStyles.map((style) => (
              <TouchableOpacity
                key={style.id}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedStyle(style.id);
                  setShowStyleModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{style.icon} {style.label}</Text>
                <Text style={styles.modalOptionMeta}>{style.description}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              style={styles.modalClose}
              onPress={() => setShowStyleModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  selector: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  selectorTextSmall: {
    color: 'white',
    fontSize: 14,
    flex: 1,
  },
  selectorArrow: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
  },
  generateButton: {
    backgroundColor: 'linear-gradient(90deg, #ff6b6b 0%, #ffa726 100%)',
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  videoItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  videoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  videoTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  videoMeta: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f59e0b',
    borderRadius: 3,
  },
  progressText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  videoActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2d3748',
    marginBottom: 4,
  },
  modalOptionMeta: {
    fontSize: 14,
    color: '#718096',
  },
  modalClose: {
    marginTop: 16,
    padding: 16,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
});