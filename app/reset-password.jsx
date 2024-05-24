import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { useAuth, useSignIn } from "@clerk/clerk-react";
import Colors from "@/constants/Colors";
export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState("");

  const navigation = useNavigation();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  if (!isLoaded) {
    return null; // Consider showing a loading indicator
  }

  // Redirect if signed in
  if (isSignedIn) {
    navigation.push("login-screen");
  }

  const handleCreate = async () => {
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setSuccessfulCreation(true);
      setError("");
    } catch (err) {
      console.error("error", err.errors[0].longMessage);
      setError(err.errors[0].longMessage);
    }
  };

  const handleReset = async () => {
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });
      if (result.status === "needs_second_factor") {
        setSecondFactor(true);
        setError("");
      } else if (result.status === "complete") {
        setActive({ session: result.createdSessionId });
        navigation.navigate("Login");
        setError("");
      }
    } catch (err) {
      console.error("error", err.errors[0].longMessage);
      setError(err.errors[0].longMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainView}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Reset your password! </Text>
        </View>
        {!successfulCreation ? (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email address</Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email adress"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={handleCreate}>
              <Text style={styles.loginButtonText}>Send the code</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Reset code</Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter the password reset code sent to your email"
                  value={code}
                  onChangeText={setCode}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>New password</Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your new password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleReset}>
              <Text style={styles.loginButtonText}>Reset</Text>
            </TouchableOpacity>
          </>
        )}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {secondFactor && (
          <Text>2FA is required, but this UI does not handle that.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {marginTop:50,
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
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 20,
  },
  error: {
    color: "red",
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
});
