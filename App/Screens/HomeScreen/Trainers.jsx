import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, FlatList, Modal, TouchableOpacity } from "react-native";
import Heading from "../../Components/Heading";
import GlobalAPI from "../../Utils/GlobalAPI";
import TrainersItem from "./TrainersItem";
import Colors from "../../Utils/Colors";
export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getTrainers();
  }, []);

  const getTrainers = () => {
    GlobalAPI.getTrainers().then((resp) => {
      if (resp && resp.trainers) {
        setTrainers(resp.trainers);
      } else {
        console.error("Invalid response from getTrainers:", resp);
        setTrainers([]);
      }
    });
  };

  return (
    <View style={{ marginTop: 10 }}>
      <Heading
        text={"Trainers"}
        isViewAll={true}
        onPressViewAll={() => setModalVisible(true)}
      />

      <FlatList
        data={trainers}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={{ marginRight: 10 }}>
            <TrainersItem trainer={item} />
          </View>
        )}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>All Trainers</Text>
            <FlatList
              data={trainers}
              numColumns={2} //
              renderItem={({ item }) => (
                <TrainersItem
                  trainer={item}
                  onSelect={() => {
                
                    setModalVisible(false);
                  }}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "90%", // Smaller width
    maxHeight: "80%", // Limit height
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: Colors.PRIMARY,
    padding: 10,borderRadius:10
  },
});
