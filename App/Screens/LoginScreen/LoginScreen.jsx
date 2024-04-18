import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../Utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useOAuth } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import { useSignIn } from "@clerk/clerk-expo";

export default function LoginScreen({ navigation }) {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [isPasswordShown, setIsPasswordShown] = useState(false);

  WebBrowser.maybeCompleteAuthSession();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPressGoogleSignIn = React.useCallback(async () => {
    console.log("Starting Google OAuth Flow");
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId) {
        setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      // This is an important step,
      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainView}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Hi, Welcome Back! </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email address</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Email..."
              onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              value={password}
              placeholder="Password..."
              secureTextEntry={!isPasswordShown}
              style={styles.textInput}
              onChangeText={(password) => setPassword(password)}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={styles.eyeIcon}
            >
              {isPasswordShown ? (
                <Ionicons name="eye-off" size={24} color={Colors.BLACK} />
              ) : (
                <Ionicons name="eye" size={24} color={Colors.BLACK} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.loginButtonContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={onSignInPress}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("reset-password")}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account ?</Text>
          <Pressable onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.registerLink}>Register</Text>
          </Pressable>
        </View>
        <View style={styles.orLoginWithContainer}>
          <View style={styles.line} />
          <Text style={styles.orLoginWithText}>Or login with</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.socialLoginContainer}>
          <TouchableOpacity
            onPress={onPressGoogleSignIn}
            style={styles.socialButton}
          >
            <AntDesign name="google" size={20} color="black" />
            <Text>Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  mainView: {
    flex: 1,
    marginHorizontal: 22,
  },
  welcomeContainer: {
    marginVertical: 22,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 12,
    color: Colors.BLACK,
  },
  missedText: {
    fontSize: 16,
    color: Colors.BLACK,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "400",
    marginVertical: 8,
  },
  textInputContainer: {
    width: "100%",
    height: 48,
    borderColor: Colors.PRIMARY,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 22,
    position: "relative", // Added for positioning the eye icon correctly
  },
  textInput: {
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
  },
  rememberMeContainer: {
    flexDirection: "row",
    marginVertical: 6,
  },
  checkbox: {
    marginRight: 8,
  },
  loginButtonContainer: {
    alignItems: "center", // Center children horizontally
    width: "100%", // Ensure the container takes full width to center children correctly
  },
  forgotPasswordContainer: {
    marginTop: 10, // Add some space between the login button and the forgot password link
  },
  forgotPasswordText: {
    color: Colors.PRIMARY, // Use your theme color or any color that indicates an action/link
    fontSize: 16,
  },
  // Update the loginButton style as needed
  loginButton: {
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    paddingHorizontal: 30,
    width: "80%", // Adjust the width as needed
    marginVertical: 10,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  orLoginWithContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 190,
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.grey,
    marginHorizontal: 10,
  },
  orLoginWithText: {
    fontSize: 14,
  },
  socialLoginContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: 52,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    marginRight: 4,
    borderRadius: 10,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 22,
  },
  registerText: {
    fontSize: 16,
    color: Colors.BLACK,
  },
  registerLink: {
    fontSize: 16,
    color: Colors.PRIMARY,
    fontWeight: "bold",
    marginLeft: 6,
  },
});
