import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../Utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/core";
import { TextInput } from "react-native-gesture-handler";
import {
  CardForm,
  CardField,
  StripeProvider,
  useConfirmPayment,
} from "@stripe/stripe-react-native";
import { useUser } from "@clerk/clerk-expo";
import moment from "moment";
import GlobalAPI from "../../Utils/GlobalAPI";
const API_URL = "http://192.168.1.129:3000";
const PUBLISHABLE_KEY =
  "pk_test_51OuYOCRqRmTxzPBOLwxDwFgkoiNZdsScBfbrXtbWc5PI3IjxfWwdtjT2wEk2iQ1Q21Updvj7xwshTmGHMOnp9Ygh00W4I3bihS";

export default function Payment({}) {
  const navigation = useNavigation();
  const route = useRoute();
  const price = route.params?.price;  

  const subscriptionID = route.params?.subscriptionID;
const [email, setEmail] = useState();
  const [cardDetails, setCardDetails] = useState();
  const { confirmPayment, loading } = useConfirmPayment();
  const { user } = useUser();

  useEffect(() => {
    console.log("Received parameters:", route.params);
  }, []);
  
  const fetchPaymentIntentClientSecret = async () => {
    const url = `${API_URL}/create-payment-intent`;
    console.log(`Attempting to fetch from URL: ${url}`);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: price, // Make sure this is correctly set
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const json = await response.json();
      console.log("Response JSON:", json);
      return json;
    } catch (e) {
      console.error("Fetch payment intent client secret failed:", e);
      return { error: e.message };
    }
  };

  const handlePayPress = async () => {
    if (!email || !cardDetails?.complete) {
      Alert.alert("Please enter complete card details and email.");
      return;
    }

    const billingDetails = { email: email };

    const { clientSecret, error } = await fetchPaymentIntentClientSecret();

    if (error) {
      console.log("Unable to process payment:", error);
      Alert.alert("Payment Error", "Unable to process payment at this time.");
      return;
    }

    const { paymentIntent, error: confirmError } = await confirmPayment(
      clientSecret,
      {
        paymentMethodType: "Card",
        billingDetails: billingDetails,
      }
    );

    if (confirmError) {
      console.log(`Payment confirmation error: ${confirmError.message}`);
      Alert.alert("Payment Error", confirmError.message);
      return;
    }
    if (!subscriptionID) {
      console.error("No subscription ID provided.");
      Alert.alert("Error", "Subscription information is missing.");
      return;
    }

    const currentDate = moment().format("YYYY-MM-DD");
    const currentTime = moment().format("HH:mm:ss");

    if (paymentIntent) {
      Alert.alert("Payment Successful", "Thank you for your payment!");
      console.log("Payment successful:", paymentIntent);

      // Make sure to include 'currentDate' and 'currentTime' when creating the 'subscriptionData' object
      const subscriptionData = {
        subscriptionID: subscriptionID, // Assuming 'subscriptionID' is the correct field name
        date: currentDate, // Using the variable from the scope
        time: currentTime, // Using the variable from the scope
      };

      try {
        const result = await GlobalAPI.createActiveSubscription(
          subscriptionData
        );
        console.log("Active subscription created successfully:", result);
        navigation.navigate("payment", {
          subscriptionID: subscriptionID,
          price: 20000,
        });
      } catch (error) {
        console.error("Error creating active subscription:", error);
        Alert.alert("Subscription Error", "Failed to activate subscription.");
      }
    }
  };
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StripeProvider publishableKey={PUBLISHABLE_KEY}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.BLACK} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Payment</Text>
          </View>
          <View style={styles.subContainer}>
            <TextInput
              autoCapitalize="none"
              placeholder="E-mail"
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
            />
            <CardField
              postalCodeEnabled={true}
              placeholder={{
                number: "4242 4242 4242 4242",
              }}
              style={styles.card}
              onCardChange={(cardDetails) => {
                setCardDetails(cardDetails);
              }}
            />

            <View style={styles.buttonContainer}>
              <Text style={styles.priceText}>${(price / 100).toFixed(2)}</Text>
              <TouchableOpacity
                onPress={handlePayPress}
                style={styles.customButton}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Pay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </StripeProvider>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.BLACK,
    padding: 15,
  },
  priceText: {
    color: Colors.BLACK, // Use your color scheme
    fontSize: 16, // Match your button text size or adjust as needed
    fontWeight: "bold", // Optional: makes the price stand out
    // Add any additional styling as needed
  },

  container: {
    flex: 1,
    justifyContent: "center",
    margin: 10,
  },
  subContainer: {
    flex: 1,
    justifyContent: "center",
    margin: 10,
  },
  customButton: {
    backgroundColor: Colors.PRIMARY_OPACITY,
    padding: 8, // Reduced padding
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: 100, // Explicit width
    height: 40,
  },
  buttonContainer: {
    flexDirection: "row", // Align items horizontally
    justifyContent: "space-between", // Space out the button and the price display
    alignItems: "center", // Center items vertically
    marginRight: 20, // Keep your existing margin on the right
    marginTop: 20, // Add some space above the container
  },

  buttonText: {
    color: Colors.GRAY, // Example button text color
    fontSize: 16,
    // Add more styling as needed
  },
  input: {
    backgroundColor: "#FCDEE7",
    overflow: "hidden",
    borderRadius: 10,
    height: 50,
    padding: 10,
  },
  card: {
    width: "100%",
    height: 170,
    marginVertical: 20,
    backgroundColor: "FCDEE7",
    borderRadius: 10,
  },
  cardContainer: {
    backgroundColor: "#FCDEE7",
    borderRadius: 10,
  },
});
