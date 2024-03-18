import { View, Text, StyleSheet, FlatList } from 'react-native'
import React from 'react'

export default function SubscriptionsActive() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Subscriptions</Text>
      <FlatList
        data={activeSubscriptions}
        keyExtractor={(item) => item.id.toString()} // Ensure you have a unique 'id' for each subscription
        renderItem={({ item }) => (
          <View style={styles.subscriptionCard}>
            <Text style={styles.subscriptionName}>{item.name}</Text>
            <Text>Price: ${item.price}</Text>
            <Text>Subscription Type: {item.type}</Text> 
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subscriptionCard: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  subscriptionName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  // Add any other styles you may need
});