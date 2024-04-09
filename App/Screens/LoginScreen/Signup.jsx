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
import { ScrollView } from "react-native-gesture-handler";
  
import { useOAuth, useSignUp } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
 export default function Signup({navigation}) {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
 
   
   const [isSubmitting, setIsSubmitting] = useState(false);
   
   
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

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // This verifies the user using email code that is delivered.
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={{ marginVertical: 12 }}>
            <Text style={styles.headerText}>Create Account</Text>
          </View>
          <View>
            {!pendingVerification && (
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.label}>First name</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    autoCapitalize="none"
                    value={firstName}
                    placeholder="Enter your first name"
                    onChangeText={(firstName) => setFirstName(firstName)}
                    style={styles.input}
                  />
                </View>
                <Text style={styles.label}>Last name</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    autoCapitalize="none"
                    value={lastName}
                    placeholder="Enter your last name"
                    onChangeText={(lastName) => setLastName(lastName)}
                    style={styles.input}
                  />
                </View>
                <Text style={styles.label}>Email address</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter your email adress"
                    onChangeText={(email) => setEmailAddress(email)}
                    keyboardType="email-address"
                    style={styles.input}
                  />
                </View>
               
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    value={password}
                    placeholder="Password..."
                    secureTextEntry={!isPasswordShown}
                    onChangeText={(password) => setPassword(password)}
                    style={styles.input}
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
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <TouchableOpacity
                    onPress={onSignUpPress}
                    disabled={isSubmitting}
                    style={styles.signUpButton}
                  >
                    <Text style={styles.signUpButtonText}> Sign up</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.orText}>Or Sign up with</Text>
                  <View style={styles.divider} />
                </View>

                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
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
                <View style={styles.footerContainer}>
                  <Text style={styles.alreadyAccountText}>
                    Already have an account
                  </Text>
                  <Pressable onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.loginText}>Login</Text>
                  </Pressable>
                </View>
              </View>
            )}
            {pendingVerification && (
              <View style={{ marginBottom: 15 }}>
                <Text style={styles.label}>Code verification</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    value={code}
                    placeholder="Enter your code"
                    onChangeText={(code) => setCode(code)}
                    style={styles.input}
                  />
                </View>
                <TouchableOpacity
                  onPress={onPressVerify}
                  style={styles.signUpButton}
                >
                  <Text style={styles.signUpButtonText}>Verify Email</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
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
    marginTop: 10,
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
    marginVertical: 12,
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
