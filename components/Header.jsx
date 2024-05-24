import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { client } from "@/utils/KindeConfig";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
export default function Header() {
  const [user, setUser] = useState();
  useEffect(() => {
    getUserData();
  }, []);
  const getUserData = async () => {
    const user = await client.getUserDetails();
    setUser(user);
  };
  return (
    <View style={styles.container}>
      <View style={styles.profileMainContainer}>
        <View style={styles.profile}>
          <Image source={{ uri: user?.picture }} style={styles.userImage} />
          <View>
            <Text style={{ color: Colors.BLACK, fontFamily: "Lato-Regular" }}>
              Welcome,
            </Text>
            <Text
              style={{
                color: Colors.BLACK,
                fontSize: 18,
                fontFamily: "Lato-Bold",
              }}
            >
              {user?.given_name}
            </Text>
          </View>
        </View>
        <Ionicons name="notifications" size={24} color="black" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 30,
    backgroundColor: Colors.PRIMARY_OPACITY,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,marginBottom:20
  },
  profileMainContainer: {marginTop:30,
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
  },
  profile: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    gap: 10,
  },

  
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 70,
  },
});
