import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import Colors from "../../Utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Linking } from "react-native";
import { useClerk } from "@clerk/clerk-expo";
 export default function ProfileScreen() {
  const { user, signOut } = useClerk();
  const navigation = useNavigation();

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
      name: "Logout",
      icon: "log-out",
    },
  ];
  const handlePress = (item) => {
    switch (item.name) {
      case "Home":
        navigation.navigate("home");
        break;
      case "Bookings":
        navigation.navigate("booking");
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
      case "Logout":
        signOut()
          .then(() => {
            navigation.navigate("LoginScreen"); 
          })
          .catch((err) => {
            console.error("Failed to log out:", err);
          });
        break;
      default:
        console.log("Default case");
    }
  };
  return (
    <View>
      <View
        style={{
          backgroundColor: Colors.PRIMARY_OPACITY,
        }}
      >
        <Text
          style={{
            padding: 10,
            fontFamily: "Lato-Bold",
            fontSize: 28,
            color: Colors.WHITE,
          }}
        >
          Profile
        </Text>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: user.imageUrl }}
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
            {user.fullName}
          </Text>
          <Text
            style={{
              fontFamily: "Lato-Regular",
              fontSize: 16,
              marginTop: 10,
              color: Colors.WHITE,
            }}
          >
            {user?.primaryEmailAddress.emailAddress}
          </Text>
        </View>
      </View>
      <View style={{ paddingTop: 60 }}>
        <FlatList
          data={profileMenu}
          keyExtractor={(item) => item.id.toString()} // Add keyExtractor for item uniqueness
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
              onPress={() => handlePress(item)} // Use handlePress here
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
