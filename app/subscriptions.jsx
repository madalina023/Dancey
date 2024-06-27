import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import GlobalAPI from "@/utils/GlobalAPI";
import { client } from "@/utils/KindeConfig";

export default function Subscriptions() {
  const [user, setUser] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);
  const navigation = useNavigation();

  const getUserData = async () => {
    try {
      const user = await client.getUserDetails();
      setUser(user);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const checkSubscriptionAndNavigate = async (subscription) => {
    const userEmail = user?.email;
    if (userEmail) {
      const result = await GlobalAPI.getActiveSubscription(userEmail);
      const hasActiveSubscription = result.activeSubscriptions.some(
        (sub) => sub.statusSubscription === "Active"
      );
      if (hasActiveSubscription) {
        Alert.alert("You already have an active subscription.");
      } else {
        navigation.navigate("payment", {
          price: subscription.price * 100,
          subscriptionID: subscription.id,
        });
      }
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchActiveSubscriptions = async () => {
        try {
          const userEmail = user.email;
          const result = await GlobalAPI.getActiveSubscription(userEmail);
          setActiveSubscriptions(result.activeSubscriptions);
        } catch (error) {
          console.error("Failed to fetch active subscriptions:", error);
        }
      };

      const updateStatuses = async () => {
        try {
          await GlobalAPI.checkAndUpdateSubscriptionStatuses();
        } catch (error) {
          console.error("Failed to update subscription statuses:", error);
        }
      };

      fetchActiveSubscriptions();
      updateStatuses();
    }
  }, [user]);

  const getSubscription = () => {
    GlobalAPI.getSubscription()
      .then((resp) => {
        setSubscriptions(resp.subscriptions);
      })
      .catch((error) => {
        console.error("Failed to fetch subscriptions:", error);
        setSubscriptions([]);
      });
  };

  useEffect(() => {
    getSubscription();
  }, []);

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.BLACK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscriptions</Text>
      </View>
      <View style={styles.content}>
        {subscriptions.map((subscription) => (
          <View key={subscription.id} style={styles.subscriptionCard}>
            <Image
              source={{ uri: subscription.image.url }}
              style={styles.fullImage}
              resizeMode="cover"
            />
            <Text style={styles.name}>{subscription.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>${subscription.price}</Text>
              <TouchableOpacity
                onPress={() => checkSubscriptionAndNavigate(subscription)}
              >
                <Text style={styles.touchableText}>Choose</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.BLACK,
    padding: 15,
  },
  subscriptionCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    marginBottom: 15,
    padding: 10,
    marginTop: 10,
    marginHorizontal: 15,
    justifyContent: "space-between", 
    flex: 1, 
  },

  fullImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    objectFit: "fill",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  priceRow: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    width: "100%", 
  },
  price: {
    fontSize: 16,
    color:Colors.GRAY,
  },
  touchableText: {
    fontSize: 16,
    color: Colors.PRIMARY_DARK,
    backgroundColor: Colors.PRIMARY_OPACITY,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    overflow: "hidden",
    textAlign: "center",
    marginHorizontal: 10,
  },
});
