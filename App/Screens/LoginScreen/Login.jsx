import { View, Text, Image, StyleSheet, TouchableOpacity, onPress } from 'react-native'
import React from 'react'
import Colors from '../../Utils/Colors'
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from '../../hooks/useWarmUpBrowser';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const onPress = React.useCallback(async () => {
    console.log("SCO")
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();
 
      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <Image
        source={require('./../../../assets/images/logo-dancey.png')}
        style={styles.loginImage}
      />
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <Text style={styles.titleText}>
           Find
            <Text style={{fontWeight: 'bold'}}> your favorite</Text> styles.
          </Text>
          <Text style={styles.descriptionText}>
              A dynamic dance school where mirrored walls echo the dedication of students.
              </Text>
          <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loginImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  subContainer: {
    backgroundColor: Colors.PRIMARY_OPACITY,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    width:'100%'
  },
  titleText: {
    fontSize: 27,
    color: Colors.WHITE,
    textAlign: 'center'
  },
  descriptionText: {
    fontSize: 17,
    color: Colors.WHITE,
    textAlign: 'center',
    marginTop: 20
  },
  button: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    borderRadius: 99,
    marginTop: 20
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 17,
    color: Colors.BLACK
  }
});