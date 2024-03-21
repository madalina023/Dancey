import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../Utils/Colors';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import GlobalAPI from '../../Utils/GlobalAPI';
import { Alert } from 'react-native';
export default function SubscriptionsScreen() {
  const navigation = useNavigation();
  const [subscriptions, setSubscriptions] = useState([]);
const [activeSubscriptions, setActiveSubscriptions] = useState([]);

const checkSubscriptionAndNavigate = (subscription) => {
  // Assuming each subscription has a 'statusSubscription' field that could be 'Active' or 'Expired'
const hasActiveSubscription = activeSubscriptions.some(
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
};
console.log("Active subscriptions:", activeSubscriptions);


  useEffect(() => {
    getSubscription();
     const updateStatuses = async () => {
      try {
        await GlobalAPI.checkAndUpdateSubscriptionStatuses();
        console.log("Subscription statuses updated.");
      } catch (error) {
        console.error("Failed to update subscription statuses:", error);
      }
    };
  const fetchActiveSubscriptions = async () => {
    try {
      const result = await GlobalAPI.getActiveSubscription();
      setActiveSubscriptions(result.activeSubscriptions); // Adjust based on actual response structure
    } catch (error) {
      console.error("Failed to fetch active subscriptions:", error);
    }
  };

  fetchActiveSubscriptions();
    updateStatuses();
  }, []);

  const getSubscription = () => {
    GlobalAPI.getSubscription().then(resp => {
        setSubscriptions(resp.subscriptions); // Assuming this is the correct path based on your log
    }).catch(error => {
        console.error('Failed to fetch subscriptions:', error);
        setSubscriptions([]);
    });
  };

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
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    marginLeft: 15
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
    justifyContent: 'space-between', // This will help in positioning elements inside
    flex: 1, // Make sure it's a flex container
  },
  
  fullImage: {
    width: '100%', // Take full width of the screen
    height: 200, // Adjust the height as needed
    borderRadius: 8, 
    objectFit:'fill'
   },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10, // Space between image and text
  },
  priceRow: {
    flexDirection: 'row', // Lay out children in a row
    justifyContent: 'space-between', // Space between items
    alignItems: 'center', // Align items vertically
    width: '100%', // Ensure the row takes up the full width of the card
  },
  price: {
    fontSize: 16,
    color: '#333',
  },
  touchableText: {
    fontSize: 16,
    color: Colors.PRIMARY_DARK,
    backgroundColor: Colors.PRIMARY_OPACITY,  
    paddingHorizontal: 15,
    paddingVertical: 5,  
    borderRadius: 10,  
    overflow: 'hidden',  
    textAlign: 'center',  
    marginHorizontal: 10,  
  },
  
});
