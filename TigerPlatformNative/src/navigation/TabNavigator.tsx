// TigerPlatformNative/src/navigation/TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';

// Import all screens
import ScriptStudio from '../screens/ScriptStudio';
import ImageStudio from '../screens/ImageStudio';
import VideoStudio from '../screens/VideoStudio';
import AICoach from '../screens/AICoach';
import LegalShield from '../screens/LegalShield';
import Settings from '../screens/Settings';

const Tab = createBottomTabNavigator();

// Custom tab bar icon component
const TabIcon: React.FC<{ emoji: string; focused: boolean }> = ({ emoji, focused }) => (
  <View style={[styles.tabIconContainer, focused && styles.tabIconFocused]}>
    <Text style={[styles.tabIcon, focused && styles.tabIconTextFocused]}>{emoji}</Text>
  </View>
);

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#1F2937',
          borderTopColor: '#374151',
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen 
        name="ScriptStudio" 
        component={ScriptStudio}
        options={{
          tabBarLabel: 'Script',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📝" focused={focused} />
          ),
        }}
      />
      
      <Tab.Screen 
        name="ImageStudio" 
        component={ImageStudio}
        options={{
          tabBarLabel: 'Image',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🎨" focused={focused} />
          ),
        }}
      />
      
      <Tab.Screen 
        name="VideoStudio" 
        component={VideoStudio}
        options={{
          tabBarLabel: 'Video',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🎬" focused={focused} />
          ),
        }}
      />
      
      <Tab.Screen 
        name="AICoach" 
        component={AICoach}
        options={{
          tabBarLabel: 'AI Coach',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🧠" focused={focused} />
          ),
        }}
      />
      
      <Tab.Screen 
        name="LegalShield" 
        component={LegalShield}
        options={{
          tabBarLabel: 'Legal',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⚖️" focused={focused} />
          ),
        }}
      />
      
      <Tab.Screen 
        name="Settings" 
        component={Settings}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⚙️" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  tabIconFocused: {
    backgroundColor: 'rgba(102, 126, 234, 0.15)',
    transform: [{ scale: 1.1 }],
  },
  tabIcon: {
    fontSize: 18,
  },
  tabIconTextFocused: {
    fontSize: 20,
  },
});

export default TabNavigator;