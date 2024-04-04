import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../Utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { AntDesign } from "@expo/vector-icons";

import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import GlobalAPI from "../../Utils/GlobalAPI";
import bcrypt from "bcryptjs"; // Ensure bcryptjs is imported
import validator from "validator"; // Import validator
import * as Crypto from 'expo-crypto';
// Inside your Signup component
const Signup = ({ navigation }) => {
  // Existing state hooks
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValid] = useState(false); // State to track if email is valid

  // State for form validation and submission feedback
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleEmailChange = (email) => {
    setEmail(email);
    setEmailValid(validator.isEmail(email)); // Validate email and update state
  };

  const handleSubmit = async () => {
    setErrors({});

    // Simple front-end validation as a demonstration
    if (!name || !email || !mobileNumber || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
     
    // Simple password strength validation as an example
    const passwordStrengthRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (!passwordStrengthRegex.test(password)) {
      Alert.alert(
        "Password Error",
        "Password must contain at least 8 characters, including uppercase, lowercase, numbers, and symbols."
      );
      return;
    }
     // Hashing the password with SHA-256
    const hashedPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );

    const variables = {
      name,
      email,
      mobileNumber,
      password:hashedPassword,
    };

    try {
      setIsSubmitting(true);
      const response = await GlobalAPI.createUser(variables);
      console.log(response);

      // Assuming registration is successful
      setIsSubmitting(false);
      Alert.alert("Success", "Successfully registered");

      // Resetting state for all fields
      setName("");
      setEmail("");
      setMobileNumber("");
      setPassword("");
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={{ marginVertical: 22 }}>
            <Text style={styles.headerText}>Create Account</Text>
          </View>
          {/* Name Input Section */}
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter your name"
                placeholderTextColor={Colors.BLACK}
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
            </View>
          </View>

          {/* Email Input Section */}
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>Email address</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter your email address"
                placeholderTextColor={Colors.BLACK}
                keyboardType="email-address"
                onChangeText={handleEmailChange}
                value={email}
                style={styles.input}
              />
              {/* Optionally, you can show a message if the email is invalid */}
              {!emailValid && email.length > 0 && (
                <Text style={{ color: "red", fontSize: 12 }}>
                  Please enter a valid email address.
                </Text>
              )}
            </View>
          </View>

          {/* Mobile Number Input Section */}
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.phoneNumberContainer}>
              <TextInput
                placeholder="+40"
                placeholderTextColor={Colors.BLACK}
                keyboardType="numeric"
                style={styles.phoneNumberInput}
              />
              <TextInput
                placeholder="Enter your phone number"
                placeholderTextColor={Colors.BLACK}
                keyboardType="numeric"
                style={styles.phoneNumber}
                onChangeText={setMobileNumber}
                value={mobileNumber}
              />
            </View>
          </View>

          {/* Password Input Section */}
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor={Colors.BLACK}
                secureTextEntry={!isPasswordShown}
                onChangeText={setPassword}
                style={styles.input}
                value={password}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordShown(!isPasswordShown)}
                style={styles.togglePasswordVisibility}
              >
                <Ionicons
                  name={isPasswordShown ? "eye-off" : "eye"}
                  size={24}
                  color={Colors.PRIMARY}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms and Conditions Checkbox */}
          <View style={styles.termsContainer}>
            <Checkbox
              value={isChecked}
              onValueChange={setIsChecked}
              color={isChecked ? Colors.PRIMARY : undefined}
            />
            <Text style={{ marginLeft: 15 }}>
              I agree to the terms and conditions
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={styles.signUpButton} // You may use the googleSignInButton style or create a new style
            >
              <Text style={styles.signUpButtonText}>SignUp</Text>
            </TouchableOpacity>
          </View>
          {/* Divider "Or Sign up with" */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>Or Sign up with</Text>
            <View style={styles.divider} />
          </View>

          {/* Google Sign-In Button */}
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity
              onPress={onPressGoogleSignIn}
              style={styles.googleSignInButton}
            >
              <AntDesign
                name="google"
                size={20}
                color="black"
                style={styles.googleText}
              />
              <Text>Google</Text>
            </TouchableOpacity>
          </View>

          {/* Login Navigation */}
          <View style={styles.footerContainer}>
            <Text style={styles.alreadyAccountText}>
              Already have an account
            </Text>
            <Pressable onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginText}>Login</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Signup;
// Define your styles outside of your component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 22,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 12,
    color: Colors.BLACK,
  },
  label: {
    fontSize: 16,
    fontWeight: "400",
    marginVertical: 8,
  },
  inputContainer: {
    width: "100%",
    height: 48,
    borderColor: Colors.PRIMARY,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 22,
  },
  input: {
    width: "100%",
  },
  phoneNumberContainer: {
    width: "100%",
    height: 48,
    borderColor: Colors.PRIMARY,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 22,
  },
  phoneNumberInput: {
    width: "12%",
    borderRightWidth: 1,
    borderColor: Colors.PRIMARY,
    height: "100%",
  },
  phoneNumber: {
    width: "80%",
  },
  togglePasswordVisibility: {
    position: "absolute",
    right: 12,
  },
  termsContainer: {
    flexDirection: "row",
    marginVertical: 6,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.PRIMARY,
    marginHorizontal: 10,
  },
  orText: {
    fontSize: 14,
  },
  signUpButton: {
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.PRIMARY, // Or any color you prefer
    borderRadius: 10,
    paddingHorizontal: 30, // Adjust based on your design
    marginVertical: 10, // Optional: adds vertical spacing
  },

  signUpButtonText: {
    color: "#FFF", // Assuming white text color
    fontSize: 16,
  },
  googleSignInButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    width: 200,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    marginRight: 4,
    borderRadius: 10,
  },
  googleText: {
    marginRight: 10,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 22,
  },
  alreadyAccountText: {
    fontSize: 16,
    color: Colors.BLACK,
  },
  loginText: {
    fontSize: 16,
    color: Colors.PRIMARY,
    fontWeight: "bold",
    marginLeft: 6,
  },
});
