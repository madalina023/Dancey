import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Linking } from "react-native";
import { client } from "@/utils/KindeConfig";
import { router } from "expo-router";
import services from "@/utils/services";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState();

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const user = await client.getUserDetails();
    setUser(user);
  };

  const handleLogout = async () => {
    const loggedOut = await client.logout();
    if (loggedOut) {
      await services.storeData("login", "false");
      router.replace("/login");
    }
  };

  const profileMenu = [
    {
      id: 1,
      name: "Home",
      icon: "home",
    },
    {
      id: 2,
      name: "Bookings",
      icon: "bookmark-sharp",
    },
    {
      id: 3,
      name: "Contact Us",
      icon: "mail",
    },
    {
      id: 4,
      name: "Subscriptions",
      icon: "bag-check",
    },
    {
      id: 5,
      name: "Recommendations",
      icon: "bulb",
    },
    {
      id: 6,
      name: "AI Chat",
      icon: "logo-wechat",
    },
    {
      id: 7,
      name: "Logout",
      icon: "log-out",
    },
  ];

  const handlePress = (item) => {
    switch (item.name) {
      case "Home":
        navigation.navigate("index");
        break;
      case "Bookings":
        navigation.navigate("bookings");
        break;
      case "Contact Us":
        const emailUrl =
          "mailto:demian.madalina@mail.ru?subject=Courses%20info&body=Hello,";
        Linking.openURL(emailUrl).catch((err) =>
          console.error("Failed to open email composer:", err)
        );
        break;
      case "Subscriptions":
        navigation.navigate("subscriptions-active");
        break;
      case "Recommendations":
        navigation.navigate("recommendations");
        break;
      case "AI Chat":
        navigation.navigate("aichat");
        break;
      case "Logout":
        handleLogout();
        break;
      default:
        console.log("Default case");
    }
  };

  return (
    <ScrollView>
      <View>
        <View
          style={{
            backgroundColor: Colors.PRIMARY_OPACITY,
          }}
        >
          <Text
            style={{
              marginTop: 30,
              paddingTop: 10,
              paddingLeft: 10,
              fontFamily: "Lato-Bold",
              fontSize: 26,
              fontWeight: "bold",
              color: Colors.WHITE,
            }}
          >
            Profile
          </Text>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: user?.picture }}
              style={{ width: 90, height: 90, borderRadius: 90 }}
            />
            <Text
              style={{
                fontFamily: "Lato-Regular",
                fontSize: 26,
                marginTop: 10,
                color: Colors.WHITE,
              }}
            >
              {user?.given_name}
            </Text>
            <Text
              style={{
                fontFamily: "Lato-Regular",
                fontSize: 16,
                marginTop: 10,
                color: Colors.WHITE,
              }}
            >
              {user?.email}
            </Text>
          </View>
        </View>
        <View style={{ paddingTop: 60 }}>
          <FlatList
            data={profileMenu}
            keyExtractor={(item) => item.id.toString()} 
            scrollEnabled={false} 
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 40,
                  paddingHorizontal: 30,
                }}
                onPress={() => handlePress(item)} 
              >
                <Ionicons name={item.icon} size={35} color={Colors.PRIMARY} />
                <Text style={{ fontFamily: "Lato-Regular", fontSize: 20 }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 90,
  },
});
