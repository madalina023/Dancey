import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import GlobalAPI from "@/utils/GlobalAPI";
import Colors from "@/constants/Colors";
import Heading from "./Heading";
import { useNavigation } from "@react-navigation/core";
import { Link, useRouter } from "expo-router";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();
  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const resp = await GlobalAPI.getCategories();
      console.log("Categories response:", resp);
      if (resp && resp.categories) {
        setCategories(resp.categories);
      } else {
        console.log("No categories found");
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const navigateToCategory = (categoryName) => {
    setModalVisible(false);

    switch (categoryName) {
      case "Classes":
        navigation.push("classes");
        break;
      case "Calendar":
        navigation.push("calendar");
        break;
      case "Check-in":
        navigation.push("check-in");
        break;
      case "Subscriptions":
        navigation.push("subscriptions");
        break;
      case "History":
        navigation.push("history");
        break;
      default:
        console.log("Unknown Category");
        break;
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigateToCategory(item.name)}
    >
      <View style={styles.iconContainer}>
        <Image source={{ uri: item.icon.url }} style={styles.icon} />
      </View>
      <Text style={styles.textStyle}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.pageContainer}>
      <Heading
        text={"Categories"}
        isViewAll={true}
        onPressViewAll={() => setModalVisible(true)}
      />
      <FlatList
        data={categories.slice(0, 5)}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <FlatList
              data={categories}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    paddingTop: 15,
  },
  container: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  iconContainer: {
    backgroundColor: Colors.PRIMARY_LIGHT,
    padding: 20,
    borderRadius: 50,
  },
  icon: {
    width: 30,
    height: 30,
  },
  textStyle: {
    fontFamily: "Lato-Regular",
    marginTop: 8,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalView: {
    backgroundColor: Colors.WHITE,
    borderRadius: 30,
    padding: 40,
    alignItems: "center",
    shadowColor: Colors.PRIMARY_LIGHT,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 15,
    width: "90%",
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    elevation: 2,
    borderRadius: 10,
  },
});
