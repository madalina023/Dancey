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
import Checkbox from "expo-checkbox";
import { AntDesign } from "@expo/vector-icons";
import { useOAuth } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import GlobalAPI from "../../Utils/GlobalAPI";
const Login = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // OAuth logic
  WebBrowser.maybeCompleteAuthSession();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const authNavigation = useNavigation(); // Use this if you need to navigate after authentication

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
  const handleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      // Assuming getUsersAuth is properly exported and imported
      const user = await GlobalAPI.getUsersAuth(email, password);
      console.log("Login successful", user);
      console.log(navigation.getState());
      navigation.navigate( ); // Make sure 'Home' matches the screen name in your Stack.Navigator

      setIsLoading(false);
      // Navigate to your main app screen here
    } catch (error) {
      console.error(error);
      setError("Failed to login. Please check your credentials.");
      setIsLoading(false);
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
              placeholder="Enter your email address"
              placeholderTextColor={Colors.BLACK}
              keyboardType="email-address"
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor={Colors.BLACK}
              secureTextEntry={!isPasswordShown}
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}

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

        <View style={styles.rememberMeContainer}>
          <Checkbox
            style={styles.checkbox}
            value={isChecked}
            onValueChange={setIsChecked}
            color={isChecked ? Colors.PRIMARY : undefined}
          />
          <Text>Remember Me</Text>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          disabled={isLoading}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.orLoginWithContainer}>
          <View style={styles.line} />
          <Text style={styles.orLoginWithText}>Or Login with</Text>
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

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account ?</Text>
          <Pressable onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.registerLink}>Register</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

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
    borderColor: Colors.BLACK,
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
  loginButton: {
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    paddingHorizontal: 30,
    marginVertical: 10,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  orLoginWithContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    borderColor: Colors.grey,
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

export default Login;
