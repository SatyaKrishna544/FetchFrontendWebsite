import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from './providers/auth';
import { StatusBar } from 'react-native';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF3E0" />
      <Stack screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#FAF3E0',
        },
      }}>
        <Stack.Screen
          name="index"
          options={{
            title: 'Home',
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            title: 'Login',
            // Prevent going back to login after logging in
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="favorites"
          options={{
            title: 'Favorites',
            // Show header for favorites page
            headerShown: true,
            headerStyle: {
              backgroundColor: '#FAF3E0',
            },
            headerTintColor: '#6A4C93',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack>
    </AuthProvider>
  );
}