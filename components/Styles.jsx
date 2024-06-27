import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import GlobalAPI from "@/utils/GlobalAPI";
import Heading from "./Heading";
import Colors from "@/constants/Colors";
import { useNavigation } from "expo-router";

export default function Styles() {
  const [danceStyles, setDanceStyles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    getDanceStyles();
  }, []);

  const getDanceStyles = () => {
    GlobalAPI.getDanceStyle()
      .then((resp) => {
        setDanceStyles(resp?.danceStyles || []);
      })
      .catch((error) => {
        console.error("Error fetching styles:", error);
      });
  };

  return (
    <View style={{ marginTop: 15 }}>
      <Heading
        text={"Styles"}
        isViewAll={true}
        onPressViewAll={() => setModalVisible(true)}
      />
      <FlatList
        data={danceStyles}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.imageStylesContainer}
            onPress={() =>
              navigation.push("trainers-list", {
                danceStyles: item.name,
              })
            }
          >
            <Image
              source={{ uri: item?.icon?.url }}
              style={styles.stylesContainer}
            />
            <Text style={{ fontFamily: "Lato-Regular", marginTop: 5 }}>
              {item?.name}
            </Text>
          </TouchableOpacity>
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <FlatList
              data={danceStyles}
              keyExtractor={(item) => item.id}
              numColumns={3} 
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  
                  onPress={() => {
                    setModalVisible(false);
                    navigation.push("trainers-list", {
                      danceStyles: item.name,
                    });
                  }}
                >
                  <Image
                    source={{ uri: item?.icon?.url }}
                    style={styles.modalStylesContainer}
                  />
                  <Text style={{ fontFamily: "Lato-Regular", marginTop: 5 }}>
                    {item?.name}
                  </Text>
                </TouchableOpacity>
              )}
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
  imageStylesContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  stylesContainer: {
    width: 100,
    height: 100,
    borderRadius: 25,
  },
  modalStylesContainer: {
    width: 100,
    height: 100,
    borderRadius: 25,      marginTop: 20,textAlign: "center",

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
    padding: 20,
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