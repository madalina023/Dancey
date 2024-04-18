import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../Screens/LoginScreen/WelcomeScreen";
import Signup from "../Screens/LoginScreen/Signup";
import LoginScreen from "../Screens/LoginScreen/LoginScreen";
import HomeScreen from "../Screens/HomeScreen/HomeScreen";
import ForgotPasswordScreen from "../Screens/LoginScreen/ForgotPasswordScreen";
const Stack = createStackNavigator();

function AuthNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="reset-password" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

export default AuthNavigation;
