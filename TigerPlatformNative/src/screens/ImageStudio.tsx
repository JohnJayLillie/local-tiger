// src/screens/ImageStudio.tsx
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
  Image,
  Dimensions,
} from 'react-native';

interface ImageData {
  id: string;
  url: string;
  prompt: string;
  style: string;
}

const { width } = Dimensions.get('window');
const imageSize = (width - 48) / 2; // 2 columns with padding

export default function ImageStudio() {
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<ImageData[]>([
    { id: '1', url: 'https://via.placeholder.com/300/4facfe/ffffff?text=Sample+1', prompt: 'Sample image 1', style: 'photorealistic' },
    { id: '2', url: 'https://via.placeholder.com/300/667eea/ffffff?text=Sample+2', prompt: 'Sample image 2', style: 'digital-art' }
  ]);

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate API call - replace with real tiger-api call
    setTimeout(() => {
      const newImage: ImageData = {
        id: Date.now().toString(),
        url: `https://via.placeholder.com/300/ff6b35/ffffff?text=Generated+${images.length + 1}`,
        prompt: imagePrompt,
        style: 'photorealistic'
      };
      
      setImages([newImage, ...images]);
      setImagePrompt('');
      setIsGenerating(false);
      Alert.alert('Success', 'Image generated successfully!');
    }, 3000);
  };

  const handleDownloadImage = (imageId: string, prompt: string) => {
    Alert.alert('Download', `Downloading image: ${prompt}`);
  };

  const handleAddPolaroid = (imageId: string, prompt: string) => {
    Alert.alert('Polaroid Effect', `Adding polaroid border to: ${prompt}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🎨 Image Studio</Text>
        <Text style={styles.subtitle}>Create images with polaroid effects</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Generate Images</Text>
          <TextInput
            style={styles.textInput}
            value={imagePrompt}
            onChangeText={setImagePrompt}
            placeholder="Describe your image..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            multiline
          />
          
          <View style={styles.row}>
            <View style={styles.selectContainer}>
              <Text style={styles.selectLabel}>Style</Text>
              <View style={styles.selectBox}>
                <Text style={styles.selectText}>Photorealistic</Text>
              </View>
            </View>
            <View style={styles.selectContainer}>
              <Text style={styles.selectLabel}>Ratio</Text>
              <View style={styles.selectBox}>
                <Text style={styles.selectText}>16:9</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, (isGenerating || !imagePrompt.trim()) && styles.buttonDisabled]}
            onPress={handleGenerateImage}
            disabled={isGenerating || !imagePrompt.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {isGenerating ? '🔄 Creating...' : '🎨 Create Image'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Polaroid Effects</Text>
          <Text style={styles.cardSubtitle}>Tap any image below to add vintage borders</Text>
          <View style={styles.effectsRow}>
            <View style={styles.effectBox}>
              <Text style={styles.effectEmoji}>📷</Text>
              <Text style={styles.effectText}>Vintage</Text>
            </View>
            <View style={styles.effectBox}>
              <Text style={styles.effectEmoji}>🖼️</Text>
              <Text style={styles.effectText}>Classic</Text>
            </View>
            <View style={styles.effectBox}>
              <Text style={styles.effectEmoji}>✨</Text>
              <Text style={styles.effectText}>Modern</Text>
            </View>
          </View>
        </View>

        {images.length > 0 && (
          <View style={styles.card}>
            <View style={styles.galleryHeader}>
              <Text style={styles.cardTitle}>Your Images ({images.length})</Text>
              <TouchableOpacity 
                style={styles.downloadAllButton}
                onPress={() => Alert.alert('Batch Download', 'Downloading all images...')}
              >
                <Text style={styles.downloadAllText}>💾 Download All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.imageGrid}>
              {images.map((image) => (
                <View key={image.id} style={styles.imageContainer}>
                  <Image 
                    source={{ uri: image.url }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlay}>
                    <TouchableOpacity
                      style={styles.imageButton}
                      onPress={() => handleDownloadImage(image.id, image.prompt)}
                    >
                      <Text style={styles.imageButtonText}>💾</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.imageButton}
                      onPress={() => handleAddPolaroid(image.id, image.prompt)}
                    >
                      <Text style={styles.imageButtonText}>📷</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.imagePrompt} numberOfLines={2}>
                    {image.prompt}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4facfe',
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
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    fontSize: 16,
    marginBottom: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  selectContainer: {
    flex: 1,
  },
  selectLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  selectBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
  },
  selectText: {
    color: 'white',
    fontSize: 14,
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
  effectsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  effectBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  effectEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  effectText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  downloadAllButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  downloadAllText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imageContainer: {
    width: imageSize,
    marginBottom: 16,
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 4,
  },
  imageButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageButtonText: {
    fontSize: 14,
  },
  imagePrompt: {
    color: 'white',
    fontSize: 12,
    marginTop: 8,
    lineHeight: 16,
  },
});