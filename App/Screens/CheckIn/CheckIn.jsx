import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity,Image } from "react-native";
import { Camera } from "expo-camera";
import axios from "axios";import PageHeading from "../../Components/PageHeading";
import { useNavigation, useRoute } from "@react-navigation/core";
import Colors from "../../Utils/Colors";import { Ionicons } from "@expo/vector-icons";

export default function CheckIn() {
  const [hasPermission, setHasPermission] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const handleBarCodeScanned = async ({ type, data }) => {
    setShowScanner(false);
    console.log(`QR code with type ${type} and data ${data} has been scanned!`);
    setIsLoading(true); // Show loading indicator

    try {
      const response = await axios.post(
        "http://192.168.1.134:5000/validate-qr",
        { qrData: data },
        { timeout: 30000 }
      );

      if (response.data.isValid) {
        navigation.navigate("ConfirmCheckIn");
      } else {
        alert("QR Code is invalid.");
      }
    } catch (error) {
      console.error("Failed to validate QR code:", error);
      if (error.code === "ECONNABORTED") {
        alert(
          "Validation timed out. Please check your network connection and try again."
        );
      } else {
        alert("There was an error validating the QR code.");
      }
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  // Update your render logic to show a loading spinner or similar indicator
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <PageHeading title="Check-in" />
      <View style={styles.centeredContent}>
        <Image
          source={require("./../../../assets/images/checkin.png")}
          style={styles.img}
        />
        <Button
          color={Colors.PRIMARY}
          title={showScanner ? "Cancel Scan" : "Scan QR Code"}
          onPress={() => setShowScanner(!showScanner)}
        />
        {showScanner && (
          <Camera
            onBarCodeScanned={handleBarCodeScanned}
            style={styles.scanner}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%", // Ensures the content uses full width of its parent
  },
  img: {
    width: 300,
    height: 300,
    borderRadius: 50,
  },
  scanner: {
    width: 300,
    height: 300,
  },
});