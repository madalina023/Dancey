import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import Colors from "../../Utils/Colors";
import { FontAwesome5, Feather } from "@expo/vector-icons";
import Slider from "./Slider";
import Categories from "./Categories";
import Styles from "./Styles";
import Trainers from "./Trainers";

const HomeScreen = () => {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = useCallback((text) => {
    setSearchQuery(text);
  }, []);

  const handleSearch = useCallback(() => {
    console.log("Searching for:", searchQuery); // Implement your search logic here
  }, [searchQuery]);

  const ListHeader = useCallback(
    () => (
      <>
        {user && (
          <View style={styles.headerContainer}>
            <View style={styles.profileMainContainer}>
              <View style={styles.profile}>
                <Image
                  source={{ uri: user?.imageUrl }}
                  style={styles.userImage}
                />
                <View>
                  <Text
                    style={{ color: Colors.BLACK, fontFamily: "Lato-Regular" }}
                  >
                    Welcome,
                  </Text>
                  <Text
                    style={{
                      color: Colors.BLACK,
                      fontSize: 18,
                      fontFamily: "Lato-Bold",
                    }}
                  >
                    {user?.firstName}
                  </Text>
                </View>
              </View>
              <FontAwesome5 name="bookmark" size={28} color="black" />
            </View>
            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Search"
                style={styles.textInput}
                onChangeText={handleSearchChange}
                value={searchQuery}
              />
              <TouchableOpacity onPress={handleSearch} style={styles.searchBtn}>
                <Feather name="search" size={24} color={Colors.PRIMARY} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={{ padding: 20 }}>
          <Slider />
          <Categories />
          <Styles />
          <Trainers />
        </View>
      </>
    ),
    [user, searchQuery, handleSearchChange, handleSearch]
  );

  return (
    <FlatList
      ListHeaderComponent={ListHeader}
      data={[]}
      renderItem={({ item }) => <Trainers trainer={item} />}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 30,
    backgroundColor: Colors.PRIMARY_OPACITY,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  profileMainContainer: {
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
  textInput: {
    padding: 10,
    paddingHorizontal: 10,
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    width: "85%",
    fontSize: 16,
    fontFamily: "Lato-Regular",
  },
  searchContainer: {
    marginTop: 15,
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    gap: 10,
    marginBottom: 10,
    marginLeft: -10,
  },
  searchBtn: {
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderRadius: 8,marginLeft:8
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 70,
  },
});

export default HomeScreen;
