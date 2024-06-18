import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { useFonts } from "expo-font";
import { NotificationProvider } from "@/components/NotificationContext";

const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function HomeLayout() {
    const [fontsLoaded, fontError] = useFonts({
      "Lato-Regular": require("@/assets/fonts/Lato-Regular.ttf"),
      "Lato-Bold": require("@/assets/fonts/Lato-Bold.ttf"),
    });

  return (
    <NotificationProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login-screen" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="reset-password" />
        <Stack.Screen name="calendar" />
        <Stack.Screen name="check-in" />
        <Stack.Screen name="confirm-check-in" />
        <Stack.Screen name="classes" />
        <Stack.Screen name="subscriptions" />
        <Stack.Screen name="subscriptions-active" />
        <Stack.Screen name="payment" />
        <Stack.Screen name="history" />
        <Stack.Screen name="recommendations" />
        <Stack.Screen name="aichat" />
        <Stack.Screen name="description-classes" />
        <Stack.Screen name="trainers-list" />
      </Stack>
    </NotificationProvider>
  );
} 