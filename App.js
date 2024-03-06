import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlexStyle } from 'react-native';
import Login from './App/Screens/LoginScreen/Login';
import {ClerkProvider, SignedIn, SignedOut} from '@clerk/clerk-expo';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from './App/Navigation/TabNavigation';
import * as WebBrowser from 'expo-web-browser';
import { useFonts } from 'expo-font';

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
  const [fontsLoaded, fontError] = useFonts({
    'Lato-Regular': require('./assets/fonts/Lato-Regular.ttf'),
    'Lato-Bold': require('./assets/fonts/Lato-Bold.ttf'),
    'Outfit-Bold': require('./assets/fonts/Outfit-Bold.ttf'),
    'Outfit-Medium': require('./assets/fonts/Outfit-Medium.ttf'),
    'Outfit-Regular': require('./assets/fonts/Outfit-Regular.ttf')
  });
  return (
    <ClerkProvider
    //  tokenCache={tokenCache} 
    publishableKey='pk_test_Z3VpZGVkLWZveC04Ni5jbGVyay5hY2NvdW50cy5kZXYk'>
    <View style={styles.container}>
      
      <SignedIn>
      <NavigationContainer>
        <TabNavigation/>
        </NavigationContainer>
        </SignedIn>
        <SignedOut>    
        <Login/> 
        </SignedOut>
     <StatusBar style="auto" />
    </View>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:20
  },
});
