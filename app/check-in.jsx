import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Image, Alert } from "react-native";
import { Camera } from "expo-camera/legacy";
import axios from "axios";
import { useNavigation } from "@react-navigation/core";
import GlobalAPI from "@/utils/GlobalAPI";
import PageHeading from "@/components/PageHeading";
import Colors from "@/constants/Colors";
import { client } from "@/utils/KindeConfig";

export default function CheckIn() {
  const [hasPermission, setHasPermission] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingSessions, setRemainingSessions] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();

    const fetchUserDataAndSessions = async () => {
      try {
        const user = await client.getUserDetails();
        const userEmail = user.email;
        const userCheckIns = await GlobalAPI.getUserCheckIns(userEmail);

        const subscriptionDetails = await GlobalAPI.getActiveSubscription(
          userEmail
        );
        if (
          subscriptionDetails.activeSubscriptions &&
          subscriptionDetails.activeSubscriptions.length > 0
        ) {
          const activeSubscription = subscriptionDetails.activeSubscriptions[0];
          const { subscriptions, date: subscriptionStartDate } =
            activeSubscription;
          const totalSessions = subscriptions[0].name.includes("12")
            ? 12
            : subscriptions[0].name.includes("8")
            ? 8
            : subscriptions[0].name.includes("4")
            ? 4
            : 0;

          const relevantCheckIns = userCheckIns.filter(
            (checkIn) =>
              new Date(checkIn.date) >= new Date(subscriptionStartDate)
          );

          const remaining = totalSessions - relevantCheckIns.length;
          setRemainingSessions(remaining);

          if (remaining === 0) {
            Alert.alert(
              "No Sessions Remaining",
              "You don't have more sessions. Please buy a subscription.",
              [
                {
                  text: "OK",
                  onPress: () => navigation.navigate("index"), // Navigate to Home screen on OK press
                },
              ],
              { cancelable: false }
            );
          }
        } else {
          console.warn("No active subscription found for user.");
        }
      } catch (error) {
        console.error(
          "Failed to fetch check-ins or subscription details:",
          error
        );
      }
    };

    fetchUserDataAndSessions();
  }, []);

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
        navigation.navigate("confirm-check-in");
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

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <PageHeading title="Check-in" />
      <View style={styles.centeredContent}>
        <Image
          source={require("@/assets/images/checkin.png")}
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
    marginTop: 30,
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
  noSessionsText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
