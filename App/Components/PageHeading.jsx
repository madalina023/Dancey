import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/core";
import { Ionicons } from "@expo/vector-icons";
export default function PageHeading({ title }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
      onPress={() => navigation.goBack()}
    >
      <Ionicons name="arrow-back" size={24} color="black" />
      <Text style={{ fontFamily: "Lato-Bold", fontSize: 22 }}>{title}</Text>
    </TouchableOpacity>
  );
}
