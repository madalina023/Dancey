import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import Colors from "../../Utils/Colors";
import { useNavigation } from "@react-navigation/native";
import GlobalAPI from "../../Utils/GlobalAPI";
import moment from "moment";

const SubscriptionsActive = () => {
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const calculateExpiryDate = (dateString, timeString) => {
    const now = new Date();
    const expiryDate = new Date(dateString);
    expiryDate.setMonth(expiryDate.getMonth() + 1); // Adds one month to the date

    // Compare expiry date to current date
    if (expiryDate <= now) {
      return "Expired";
    } else {
      return `${expiryDate.toDateString()} at ${timeString}`;
    }
  };
  useEffect(() => {
    const fetchActiveSubscriptions = async () => {
      setLoading(true);
      try {
        const result = await GlobalAPI.getActiveSubscription();
        const subscriptionsWithDateTimeAndStatus =
          result.activeSubscriptions.flatMap((as) =>
            as.subscriptions.map((sub) => ({
              ...sub,
              expiryDate: calculateExpiryDate(as.date, as.time),
              status: as.statusSubscription, // Add the statusSubscription here
            }))
          );
        setActiveSubscriptions(subscriptionsWithDateTimeAndStatus);
      } catch (error) {
        console.error("Error fetching active subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveSubscriptions();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (activeSubscriptions.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No active subscriptions found.</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      {activeSubscriptions.map((subscription) => (
        <View key={subscription.id} style={styles.subscriptionCard}>
          <Image
            source={{ uri: subscription.image.url }}
            style={styles.fullImage}
          />
          <View style={styles.textArea}>
            <View style={styles.namePriceRow}>
              <Text style={styles.name}>{subscription.name}</Text>
              <Text style={styles.price}>${subscription.price}</Text>
            </View>
            <Text style={styles.dateTime}>
              {subscription.status === "Active" ? ( 
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Expires at:</Text>{" "}
                  {subscription.expiryDate}
                </Text>
              ) : (
                <Text style={styles.expiredText}>
                  {subscription.expiryDate}
                </Text>
              )}
            </Text> 
            
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  subscriptionCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    marginBottom: 15,
    padding: 10,
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    objectFit: "fill",
  },
  textArea: {
    width: "100%",
  },
  namePriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
  },
  price: {
    fontSize: 18,
    color: "#333",
    textAlign: "right",
  },
  dateTime: {
    fontSize: 17,
    color: Colors.DARK_GRAY,
    textAlign: "left", // Center the expiry date under the name and price
    marginTop: 5,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  expiredText: {
    color: Colors.RED, // Assuming you have a RED color defined, or use a string like '#FF0000'
    fontSize: 17,
    fontWeight: "bold",
  },
});

export default SubscriptionsActive;
