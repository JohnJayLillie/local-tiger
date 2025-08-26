// TigerPlatformNative/src/screens/LegalShield.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Alert 
} from 'react-native';

export default function LegalShield() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const legalServices = [
    {
      id: 'compliance',
      title: 'Content Compliance Check',
      description: 'AI-powered legal compliance scanning for your content',
      icon: '🛡️',
      status: 'Available'
    },
    {
      id: 'copyright',
      title: 'Copyright Protection',
      description: 'Protect your AI-generated content with copyright analysis',
      icon: '©️',
      status: 'Available'
    },
    {
      id: 'terms',
      title: 'Terms Generator',
      description: 'Generate legal terms and conditions for content platforms',
      icon: '📋',
      status: 'Coming Soon'
    },
    {
      id: 'privacy',
      title: 'Privacy Policy Builder',
      description: 'Build GDPR-compliant privacy policies for your content',
      icon: '🔒',
      status: 'Coming Soon'
    },
    {
      id: 'licensing',
      title: 'Content Licensing',
      description: 'Manage licensing agreements for AI-generated media',
      icon: '📄',
      status: 'Coming Soon'
    },
    {
      id: 'consultation',
      title: 'Legal Consultation',
      description: '24/7 AI legal assistant for content creation questions',
      icon: '⚖️',
      status: 'Premium'
    }
  ];

  const handleServicePress = (service: any) => {
    if (service.status === 'Available') {
      setSelectedService(service.id);
      // TODO: Navigate to specific legal service or show modal
      Alert.alert(
        service.title,
        `${service.description}\n\nThis feature will help ensure your Tiger-generated content meets legal requirements.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: () => console.log('Service activated:', service.id) }
        ]
      );
    } else if (service.status === 'Coming Soon') {
      Alert.alert('Coming Soon', `${service.title} will be available in a future update.`);
    } else if (service.status === 'Premium') {
      Alert.alert('Premium Feature', `${service.title} is available with Tiger Premium subscription.`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return '#10B981';
      case 'Coming Soon': return '#F59E0B';
      case 'Premium': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>⚖️ Legal Shield</Text>
          <Text style={styles.subtitle}>
            Protect your content with AI-powered legal compliance tools
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Compliant</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Protection</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>AI</Text>
            <Text style={styles.statLabel}>Powered</Text>
          </View>
        </View>

        {/* Legal Services */}
        <View style={styles.servicesContainer}>
          <Text style={styles.sectionTitle}>Legal Services</Text>
          
          {legalServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[
                styles.serviceCard,
                selectedService === service.id && styles.serviceCardSelected
              ]}
              onPress={() => handleServicePress(service)}
              activeOpacity={0.7}
            >
              <View style={styles.serviceHeader}>
                <View style={styles.serviceIcon}>
                  <Text style={styles.serviceIconText}>{service.icon}</Text>
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.serviceDescription}>{service.description}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(service.status) }]}>
                  <Text style={styles.statusText}>{service.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Legal Notice */}
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeTitle}>⚠️ Legal Notice</Text>
          <Text style={styles.noticeText}>
            Tiger Legal Shield provides AI-powered legal guidance for content creation. 
            This is not a substitute for professional legal advice. For complex legal matters, 
            consult with a qualified attorney.
          </Text>
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 80,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  servicesContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  serviceCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  serviceCardSelected: {
    borderColor: '#667eea',
    backgroundColor: '#1E293B',
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#334155',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceIconText: {
    fontSize: 24,
  },
  serviceInfo: {
    flex: 1,
    marginRight: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  noticeContainer: {
    margin: 24,
    padding: 20,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  bottomPadding: {
    height: 100,
  },
});