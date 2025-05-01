import { Tabs, usePathname } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

export default function TabLayout() {
  const pathname = usePathname(); // Get the current route path

  return (
    <View className="flex-1 bg-gray-100">
      <Tabs
        screenOptions={{
          tabBarButton: HapticTab,
          tabBarInactiveTintColor: "#B0B0B0",
          tabBarActiveTintColor: "#2563EB",
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
        <Tabs.Screen name="screens/worksheets/[id]" options={{ href: null }} />
        <Tabs.Screen name="screens/dashboards/[id]" options={{ href: null }} />
        <Tabs.Screen name="screens/quizzes/[id]" options={{ href: null }} />
        <Tabs.Screen
          name="screens/quizzes/index"
          options={{
            title: 'Quizzes',
            tabBarIcon: ({ color }) => (
              <Ionicons
              size={24}
              name="bar-chart-outline"
              color={
                pathname.startsWith('/screens/quizzes') // Check if the current path is within the quizzes folder
                  ? '#2563EB' // Active color
                  : color // Default inactive color
              }
            />
            ),
            tabBarLabelStyle: {color: pathname.startsWith('/screens/quizzes') ? '#2563EB' : '#B0B0B0'}
          }}
        />
        <Tabs.Screen
          name="screens/worksheets/index"
          options={{
            title: 'Worksheets',
            tabBarIcon: ({ color }) => (
              <Ionicons
              size={24}
              name="documents-outline"
              color={
                pathname.startsWith('/screens/worksheets') // Check if the current path is within the quizzes folder
                  ? '#2563EB' // Active color
                  : color // Default inactive color
              }
            />
            ),
            tabBarLabelStyle: {color: pathname.startsWith('/screens/worksheets') ? '#2563EB' : '#B0B0B0'}
          }}
        />
        <Tabs.Screen
          name="screens/scan"
          options={{
            title: 'Scan',
            tabBarIcon: ({ color }) => <Ionicons size={24} name="scan-circle-outline" color={color} />,
          }}
        />
        <Tabs.Screen
          name="screens/dashboards/index"
          options={{
            title: 'Dashboards',
            tabBarIcon: ({ color }) => (
              <Ionicons
              size={24}
              name="speedometer-outline"
              color={
                pathname.startsWith('/screens/dashboards') // Check if the current path is within the quizzes folder
                  ? '#2563EB' // Active color
                  : color // Default inactive color
              }
            />
            ),
            tabBarLabelStyle: {color: pathname.startsWith('/screens/dashboards') ? '#2563EB' : '#B0B0B0'}
          }}
        />
      </Tabs>
    </View>
  );
}
