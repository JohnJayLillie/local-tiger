// TigerPlatformNative/src/screens/Settings.tsx
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
  Switch,
} from 'react-native';

interface UserSettings {
  displayName: string;
  email: string;
  companyName: string;
  primaryAIModel: 'gpt4' | 'claude' | 'both';
  contentStyle: 'professional' | 'casual' | 'technical' | 'creative' | 'adaptive';
  contentLength: 'short' | 'medium' | 'long' | 'auto';
  defaultStudio: 'youtube' | 'blog' | 'email' | 'social' | 'legal';
  autoSave: boolean;
  showProgress: boolean;
  darkMode: boolean;
  advancedMode: boolean;
  openaiKey: string;
  anthropicKey: string;
}

interface PlatformConnection {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  color: string;
}

const platformConnections: PlatformConnection[] = [
  { id: 'youtube', name: 'YouTube', icon: '📺', connected: true, color: '#FF0000' },
  { id: 'facebook', name: 'Facebook', icon: '📘', connected: false, color: '#1877F2' },
  { id: 'twitter', name: 'Twitter/X', icon: '🐦', connected: false, color: '#1DA1F2' },
  { id: 'instagram', name: 'Instagram', icon: '📸', connected: false, color: '#E4405F' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', connected: false, color: '#0A66C2' },
  { id: 'mailchimp', name: 'Mailchimp', icon: '📧', connected: false, color: '#FFE01B' },
];

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'account' | 'ai' | 'integrations' | 'workspace' | 'api' | 'privacy'>('account');
  const [settings, setSettings] = useState<UserSettings>({
    displayName: '',
    email: '',
    companyName: '',
    primaryAIModel: 'gpt4',
    contentStyle: 'professional',
    contentLength: 'medium',
    defaultStudio: 'youtube',
    autoSave: true,
    showProgress: true,
    darkMode: true,
    advancedMode: false,
    openaiKey: '',
    anthropicKey: '',
  });

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    Alert.alert('Settings Saved', 'Your settings have been saved successfully!');
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to defaults?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            setSettings({
              displayName: '',
              email: '',
              companyName: '',
              primaryAIModel: 'gpt4',
              contentStyle: 'professional',
              contentLength: 'medium',
              defaultStudio: 'youtube',
              autoSave: true,
              showProgress: true,
              darkMode: true,
              advancedMode: false,
              openaiKey: '',
              anthropicKey: '',
            });
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Your data export will begin shortly.');
  };

  const handleClearCache = () => {
    Alert.alert('Cache Cleared', 'Application cache has been cleared.');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive' }
      ]
    );
  };

  const testAPIKey = (provider: 'openai' | 'anthropic') => {
    Alert.alert('API Test', `Testing ${provider === 'openai' ? 'OpenAI' : 'Anthropic'} API connection...`);
  };

  const togglePlatformConnection = (platformId: string) => {
    Alert.alert('Platform Integration', `${platformId} integration coming soon!`);
  };

  const renderTabButton = (tab: typeof activeTab, label: string, icon: string) => (
    <TouchableOpacity
      key={tab}
      style={[
        styles.tabButton,
        activeTab === tab && styles.activeTabButton
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={styles.tabIcon}>{icon}</Text>
      <Text style={[
        styles.tabLabel,
        activeTab === tab && styles.activeTabLabel
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderSettingItem = (
    label: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    description?: string
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#3A3A3A', true: '#667eea' }}
        thumbColor={value ? '#ffffff' : '#f4f3f4'}
        style={styles.switch}
      />
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👤 Account Configuration</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Display Name</Text>
              <TextInput
                style={styles.input}
                value={settings.displayName}
                onChangeText={(value) => updateSetting('displayName', value)}
                placeholder="Your display name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={settings.email}
                onChangeText={(value) => updateSetting('email', value)}
                placeholder="your@email.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Company/Brand Name (Optional)</Text>
              <TextInput
                style={styles.input}
                value={settings.companyName}
                onChangeText={(value) => updateSetting('companyName', value)}
                placeholder="Your company or brand name"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        );

      case 'ai':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🧠 AI Configuration</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Primary AI Model</Text>
              <View style={styles.pickerContainer}>
                <TouchableOpacity style={styles.picker}>
                  <Text style={styles.pickerText}>
                    {settings.primaryAIModel === 'gpt4' ? 'OpenAI GPT-4 (Recommended)' : 
                     settings.primaryAIModel === 'claude' ? 'Anthropic Claude' : 
                     'Intelligent Routing (Both)'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Content Style Preference</Text>
              <View style={styles.pickerContainer}>
                <TouchableOpacity style={styles.picker}>
                  <Text style={styles.pickerText}>
                    {settings.contentStyle === 'professional' ? 'Professional & Polished' :
                     settings.contentStyle === 'casual' ? 'Casual & Conversational' :
                     settings.contentStyle === 'technical' ? 'Technical & Detailed' :
                     settings.contentStyle === 'creative' ? 'Creative & Engaging' :
                     'Adaptive (Per Studio)'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Default Content Length</Text>
              <View style={styles.pickerContainer}>
                <TouchableOpacity style={styles.picker}>
                  <Text style={styles.pickerText}>
                    {settings.contentLength === 'short' ? 'Short (200-500 words)' :
                     settings.contentLength === 'medium' ? 'Medium (500-1000 words)' :
                     settings.contentLength === 'long' ? 'Long (1000+ words)' :
                     'Auto-optimize per content type'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 'integrations':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔗 Platform Integrations</Text>
            
            <View style={styles.integrationsGrid}>
              {platformConnections.map((platform) => (
                <TouchableOpacity
                  key={platform.id}
                  style={styles.integrationItem}
                  onPress={() => togglePlatformConnection(platform.id)}
                >
                  <View style={styles.integrationInfo}>
                    <Text style={styles.integrationIcon}>{platform.icon}</Text>
                    <Text style={styles.integrationName}>{platform.name}</Text>
                  </View>
                  <View style={[
                    styles.connectionStatus,
                    { backgroundColor: platform.connected ? '#10B981' : '#6B7280' }
                  ]}>
                    <Text style={styles.connectionStatusText}>
                      {platform.connected ? 'Connected' : 'Connect'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'workspace':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎨 Workspace Preferences</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Default Studio</Text>
              <View style={styles.pickerContainer}>
                <TouchableOpacity style={styles.picker}>
                  <Text style={styles.pickerText}>
                    {settings.defaultStudio === 'youtube' ? '📺 YouTube Studio' :
                     settings.defaultStudio === 'blog' ? '✍️ Blog Studio' :
                     settings.defaultStudio === 'email' ? '📧 Email Studio' :
                     settings.defaultStudio === 'social' ? '📱 Social Studio' :
                     '⚖️ Legal Shield'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {renderSettingItem(
              'Auto-save drafts',
              settings.autoSave,
              (value) => updateSetting('autoSave', value),
              'Automatically save content as you work'
            )}

            {renderSettingItem(
              'Show generation progress',
              settings.showProgress,
              (value) => updateSetting('showProgress', value),
              'Display AI generation status and timing'
            )}

            {renderSettingItem(
              'Dark mode',
              settings.darkMode,
              (value) => updateSetting('darkMode', value),
              'Use dark theme across all studios'
            )}
          </View>
        );

      case 'api':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔑 API Keys & Advanced</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>OpenAI API Key</Text>
              <View style={styles.apiKeyContainer}>
                <TextInput
                  style={[styles.input, styles.apiKeyInput]}
                  value={settings.openaiKey}
                  onChangeText={(value) => updateSetting('openaiKey', value)}
                  placeholder="sk-..."
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.testButton}
                  onPress={() => testAPIKey('openai')}
                >
                  <Text style={styles.testButtonText}>Test</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Anthropic API Key (Optional)</Text>
              <View style={styles.apiKeyContainer}>
                <TextInput
                  style={[styles.input, styles.apiKeyInput]}
                  value={settings.anthropicKey}
                  onChangeText={(value) => updateSetting('anthropicKey', value)}
                  placeholder="sk-ant-..."
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.testButton}
                  onPress={() => testAPIKey('anthropic')}
                >
                  <Text style={styles.testButtonText}>Test</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            {renderSettingItem(
              'Advanced mode',
              settings.advancedMode,
              (value) => updateSetting('advancedMode', value),
              'Enable developer features and detailed controls'
            )}
          </View>
        );

      case 'privacy':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🛡️ Data & Privacy</Text>
            
            <View style={styles.privacyGrid}>
              <TouchableOpacity
                style={styles.privacyButton}
                onPress={handleExportData}
              >
                <Text style={styles.privacyButtonIcon}>📥</Text>
                <Text style={styles.privacyButtonTitle}>Export Data</Text>
                <Text style={styles.privacyButtonDescription}>Download all your content and settings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.privacyButton}
                onPress={handleClearCache}
              >
                <Text style={styles.privacyButtonIcon}>🗑️</Text>
                <Text style={styles.privacyButtonTitle}>Clear Cache</Text>
                <Text style={styles.privacyButtonDescription}>Clear temporary files and reset app state</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.privacyButton, styles.dangerButton]}
                onPress={handleResetSettings}
              >
                <Text style={styles.privacyButtonIcon}>⚠️</Text>
                <Text style={[styles.privacyButtonTitle, styles.dangerText]}>Reset Settings</Text>
                <Text style={[styles.privacyButtonDescription, styles.dangerText]}>Restore all settings to defaults</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.privacyButton, styles.dangerButton]}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.privacyButtonIcon}>🚫</Text>
                <Text style={[styles.privacyButtonTitle, styles.dangerText]}>Delete Account</Text>
                <Text style={[styles.privacyButtonDescription, styles.dangerText]}>Permanently delete account and data</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚙️ App Settings</Text>
        <Text style={styles.headerSubtitle}>Configure your account, AI preferences & platform integrations</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
        {renderTabButton('account', 'Account', '👤')}
        {renderTabButton('ai', 'AI Config', '🧠')}
        {renderTabButton('integrations', 'Platforms', '🔗')}
        {renderTabButton('workspace', 'Workspace', '🎨')}
        {renderTabButton('api', 'API Keys', '🔑')}
        {renderTabButton('privacy', 'Privacy', '🛡️')}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSaveSettings}
        >
          <Text style={styles.primaryButtonText}>💾 Save All Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleResetSettings}
        >
          <Text style={styles.secondaryButtonText}>🔄 Reset to Defaults</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Fixed: Tiger dark theme instead of gradient
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#1E293B', // Added darker header background
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8', // Updated to match Tiger theme
    textAlign: 'center',
  },
  tabContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 60,
    backgroundColor: '#1E293B', // Added background for tab area
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    backgroundColor: '#334155', // Updated tab button background
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#475569',
  },
  activeTabButton: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  activeTabLabel: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#0F172A', // Consistent background
  },
  section: {
    backgroundColor: '#1E293B', // Updated section background
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8', // Updated label color
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#334155', // Updated input background
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  pickerContainer: {
    backgroundColor: '#334155', // Updated picker background
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 12,
  },
  picker: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pickerText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#94A3B8',
  },
  switch: {
    marginLeft: 12,
  },
  integrationsGrid: {
    gap: 12,
  },
  integrationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#475569',
  },
  integrationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  integrationIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  integrationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  connectionStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  connectionStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  apiKeyContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  apiKeyInput: {
    flex: 1,
  },
  testButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 16,
  },
  privacyGrid: {
    gap: 12,
  },
  privacyButton: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#475569',
  },
  dangerButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  privacyButtonIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  privacyButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  privacyButtonDescription: {
    fontSize: 12,
    color: '#94A3B8',
  },
  dangerText: {
    color: '#FCA5A5',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: '#1E293B',
  },
  primaryButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#667eea',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#334155',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#475569',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94A3B8',
  },
});

export default Settings;