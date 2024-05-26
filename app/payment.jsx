import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/core";
import {
  CardForm,
  CardField,
  StripeProvider,
  useConfirmPayment,
} from "@stripe/stripe-react-native";
import { useUser } from "@clerk/clerk-expo";
import moment from "moment";
import GlobalAPI from "../utils/GlobalAPI";
import { client } from "@/utils/KindeConfig";

const API_URL = "http://192.168.1.134:5000";
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
  const [user, setUser] = useState();
  useEffect(() => {
    getUserData();
  }, []);
  const getUserData = async () => {
    const user = await client.getUserDetails();
    setUser(user);
  };

  const [activeSubscriptions, setActiveSubscriptions] = useState([]);

  useEffect(() => {
    const fetchAndSetSubscriptions = async () => {
      if (user) {
        const userEmail = user?.email;
        try {
          const activeSubscriptions = await GlobalAPI.getActiveSubscription(
            userEmail
          );
          console.log("Active subscriptions:", activeSubscriptions);
          setActiveSubscriptions(activeSubscriptions.activeSubscriptions);
        } catch (error) {
          console.error("Failed to fetch active subscriptions:", error);
        }
      }
    };
    fetchAndSetSubscriptions();
  }, [user]);

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
          price: price,
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

  const validateCardExpiry = (expiryMonth, expiryYear) => {
    const currentYear = new Date().getFullYear();
    const maxYear = currentYear + 5;
    if (expiryYear > maxYear) {
      return false;
    }
    return true;
  };

  const handlePayPress = async () => {
    if (!email || !cardDetails?.complete) {
      Alert.alert("Please enter complete card details and email.");
      return;
    }

    const { expiryMonth, expiryYear } = cardDetails;
    if (!validateCardExpiry(expiryMonth, expiryYear)) {
      Alert.alert(
        "Invalid Expiry Date",
        "The expiry date must be within the next 5 years."
      );
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
      navigation.navigate("index");
      const subscriptionData = {
        subscriptionID: subscriptionID,
        date: currentDate,
        time: currentTime,
        statusSubscription: "Active",
        userName: user.given_name + " " + user.family_name,
        userEmail: user.email,
      };

      try {
        const result = await GlobalAPI.createActiveSubscription(
          subscriptionData
        );
        console.log("Active subscription created successfully:", result);
        // navigation.navigate("payment", {
        //   subscriptionID: subscriptionID,
        //   price: 20000,
        // });
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
              placeholderTextColor="#000" // Updated placeholder text color
            />
            <CardField
              postalCodeEnabled={true}
              placeholder={{
                number: "4242 4242 4242 4242",
              }}
              style={styles.card}
              cardStyle={{
                textColor: "#000000", // Set the text color to black
              }}
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
    color: Colors.BLACK,
    fontSize: 16,
    fontWeight: "bold",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    margin: 10,
    marginTop: 30,
  },
  subContainer: {
    flex: 1,
    justifyContent: "center",
    margin: 10,
  },
  customButton: {
    backgroundColor: Colors.PRIMARY_OPACITY,
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 20,
    marginTop: 20,
  },

  buttonText: {
    color: Colors.GRAY,
    fontSize: 16,
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
