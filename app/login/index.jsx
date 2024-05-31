import { View, Image, TouchableOpacity,Text,StyleSheet} from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors';
import { client } from '@/utils/KindeConfig';
import services from '@/utils/services';
import { useRouter } from 'expo-router';
export default function LoginScreen() {
  const router = useRouter();
  const onPressLogin = () => {
    navigation.navigate("Login"); // Navigate to Login screen, ensure this is the correct name
  };
  const handleSignIn = async () => {
    try {
      const token = await client.login();
      if (token) {
        await services.storeData("login", "true");
        router.replace("/");
      } else {
        console.error("No token received");
      }
    } catch (error) {
      console.error("Login error:", error);
      // Handle specific error types if necessary
    }
  };
 
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Image
        source={require("@/assets/images/logo-dancey.png")}
        style={styles.loginImage}
      />
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <Text style={styles.titleText}>
            Find
            <Text style={{ fontWeight: "bold" }}> your favorite</Text> styles.
          </Text>
          <Text style={styles.descriptionText}>
            Welcome to the dynamic dance school app and elevate your dance journey
            with passion. 
          </Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Join now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnAccount} onPress={handleSignIn}>
            <Text style={styles.buttonAccount}>Already having an account?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loginImage: {
    width: "100%",
    height: "100%",
    position: "relative",
    top: 0,
    left: 0,
  },
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  subContainer: {
    backgroundColor: Colors.PRIMARY_OPACITY,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    width: "100%",
  },
  titleText: {
    fontSize: 27,
    color: Colors.WHITE,
    textAlign: "center",
  },
  descriptionText: {
    fontSize: 15,
    color: Colors.WHITE,
    textAlign: "center",
    marginTop: 20,
  },
  button: {
    padding: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 99,
    marginTop: 20,
  },
  btnAccount: {
    padding: 15,
    borderRadius: 99,
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 17,
    color: Colors.BLACK,
  },
  buttonAccount: { fontSize: 17, color: Colors.WHITE },
});
