import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { useFonts } from "expo-font";

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
    <ClerkProvider
      publishableKey="pk_test_dG9nZXRoZXItdGljay03MC5jbGVyay5hY2NvdW50cy5kZXYk"
      tokenCache={tokenCache}
    >
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
        <Stack.Screen name="description-classes" />
        <Stack.Screen name="trainers-list" />
      
      </Stack>
    </ClerkProvider>
  );
} 