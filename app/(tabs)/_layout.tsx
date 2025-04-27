import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '@/components/CustomHeader';
import { View } from 'react-native';

export default function TabLayout() {

  return (
    <View className="flex-1 bg-gray-100">
      <Tabs
        screenOptions={{
          header: () => <CustomHeader title="Home" />,
          tabBarButton: HapticTab,
          tabBarInactiveTintColor: "#B0B0B0",
          tabBarStyle: Platform.select({
            default: {
              position: 'absolute',
              justifyContent: 'center',
              flexDirection: 'column',
              height: 70,
              backgroundColor: '#FFFFFF',
              shadowColor: '#000',
              boxShadow: '0 0 12px rgba(0, 0, 0, 0.1)',
              shadowOffset: { width: 0, height: 2 },
            },
          }),
          tabBarItemStyle: {
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 6,
            marginBottom: 4
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: 2,
          },
          tabBarIconStyle: {
            marginBottom: 2,
          },
        }}>
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen
          name="screens/quiz"
          options={{
            title: 'Quiz',
            tabBarIcon: ({ color }) => <Ionicons size={24} name="bar-chart-outline" color={color} />,
          }}
        />
        <Tabs.Screen
          name="screens/worksheets"
          options={{
            title: 'Worksheets',
            tabBarIcon: ({ color }) => <Ionicons size={24} name="documents-outline" color={color} />,
          }}
        />
        <Tabs.Screen
          name="screens/scan"
          options={{
            title: 'Scan',
            tabBarIcon: ({ color }) => <Ionicons size={24} name="scan-circle-outline" color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}
