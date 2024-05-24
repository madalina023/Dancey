import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

export default function Heading({ text, isViewAll = false, onPressViewAll }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{text}</Text>
      {isViewAll && (
        <TouchableOpacity onPress={onPressViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    fontSize: 18,
    fontFamily: "Lato-Bold",
    marginBottom: 15,
  },
});
