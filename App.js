import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
    View,
   SafeAreaView,
} from "react-native";
 import { ClerkProvider, SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./App/Navigation/TabNavigation"; 
import { useFonts } from "expo-font"; 
import { LogBox } from "react-native";
import AuthNavigation from "./App/Navigation/AuthNavigation"; 
import * as SecureStore from "expo-secure-store";

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
export default function App() {
  LogBox.ignoreLogs(["ViewPropTypes will be removed"]);

  const [fontsLoaded, fontError] = useFonts({
    "Lato-Regular": require("./assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("./assets/fonts/Lato-Bold.ttf"),
   
  });

  return (
    <ClerkProvider
      publishableKey="pk_test_aG9uZXN0LWxhYi02Mi5jbGVyay5hY2NvdW50cy5kZXYk"
      tokenCache={tokenCache}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <SignedIn>
            <NavigationContainer>
              <TabNavigation />
            </NavigationContainer>
          </SignedIn>
          <SignedOut>
            <NavigationContainer>
              <AuthNavigation />
            </NavigationContainer>
          </SignedOut>
          <StatusBar style="auto" />
        </View>
      </SafeAreaView>
    </ClerkProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: -10,
  },
  safeArea: {
    flex: 1,
  },
});
