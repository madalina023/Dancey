import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import GlobalAPI from "@/utils/GlobalAPI";
import Colors from "@/constants/Colors"
import { useNavigation } from "@react-navigation/core";
import { Ionicons } from "@expo/vector-icons";

export default function Styles({ searchQuery = "" }) {
  const [danceStyles, setDanceStyles] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    getDanceStyles();
  }, [searchQuery]);

  const getDanceStyles = () => {
    GlobalAPI.getDanceStyle()
      .then((resp) => {
        const filteredStyles =
          resp?.danceStyles.filter((style) =>
            style.name.toLowerCase().includes(searchQuery.toLowerCase())
          ) || [];
        setDanceStyles(filteredStyles);
      })
      .catch((error) => {
        console.error("Error fetching styles:", error);
      });
  };

  return (
    <View style={{ marginTop: 50 }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backBtnContainer}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.BLACK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Classes</Text>
      </View>
      <FlatList
        data={danceStyles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.imageStylesContainer}
            onPress={() =>
              navigation.navigate("description-classes", {
                styleName: item.name,
                imageUrl: item.icon.url,
                description: item.description,
              })
            }
          >
            <Image
              source={{ uri: item?.icon?.url }}
              style={styles.stylesContainer}
            />
            <Text style={styles.styleName}>{item?.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imageStylesContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    padding: 10,
  },
  stylesContainer: {
    width: 50, 
    height: 50, 
    borderRadius: 25,
    marginRight: 10, 
  },
  styleName: {
    fontFamily: "Lato-Regular",
    fontSize: 16,
    color: Colors.BLACK,
  },
  backBtnContainer: {
    marginRight: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center", 
    marginBottom: 15,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 20,
    color: Colors.BLACK, 
    fontWeight: "bold",
  },
});
