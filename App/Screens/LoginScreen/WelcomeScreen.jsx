import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  onPress,
} from "react-native";
import React from "react";
import Colors from "../../Utils/Colors"; 
 import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

export default function Login() {  const navigation = useNavigation();
  
    const onPressJoin = () => {
      navigation.navigate("Signup"); // Use navigate function with the route name of your Signup screen
    };  const onPressLogin = () => {
      navigation.navigate("Login"); // Navigate to Login screen, ensure this is the correct name
    };
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Image
        source={require("./../../../assets/images/logo-dancey.png")}
        style={styles.loginImage}
      />
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <Text style={styles.titleText}>
            Find
            <Text style={{ fontWeight: "bold" }}> your favorite</Text> styles.
          </Text>
          <Text style={styles.descriptionText}>
            A dynamic dance school where mirrored walls echo the dedication of
            students.
          </Text>
          <TouchableOpacity style={styles.button} onPress={onPressJoin}>
            <Text style={styles.buttonText}>Join now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnAccount} onPress={onPressLogin}>
            
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
    fontSize: 17,
    color: Colors.WHITE,
    textAlign: "center",
    marginTop: 20,
  },
  button: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    borderRadius: 99,
    marginTop: 20,
  },
  btnAccount: {
    padding: 15,
     borderRadius: 99,
    marginTop: 20,
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
