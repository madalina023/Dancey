import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Linking,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import TrainersAboutTrainer from "@/components/TrainersAboutTrainer";
import TrainersModel from "@/components/TrainersModel";
import TrainersPhotos from "@/components/TrainersPhotos";

export default function TrainersDetailScreen() {
  const { trainer } = useRoute().params;
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);

  const renderHeader = () => (
    <>
      <TouchableOpacity
        style={styles.backBtnContainer}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.WHITE} />
      </TouchableOpacity>
      {trainer && (
        <Image
          source={{ uri: trainer.images[0]?.url }}
          style={{ width: 400, height: 300, objectFit: "cover" }}
        />
      )}
      <View style={styles.container}>
        <Text style={styles.name}>{trainer?.name}</Text>
        <View style={styles.subContainer}>
          <Text style={styles.experienceText}>
            {trainer?.experience} experience ✨
          </Text>
          <View style={styles.danceStylesContainer}>
            {trainer?.danceStyles?.map((style, index) => (
              <Text key={index} style={styles.danceStyles}>
                {style.name}
              </Text>
            ))}
          </View>
        </View>
        <Text style={styles.contactText}>
          <Entypo name="phone" size={20} color={Colors.PRIMARY} />
          {trainer?.contact}
        </Text>
        <View
          style={{
            borderWidth: 0.5,
            borderColor: Colors.LIGHT_GRAY,
            marginTop: 20,
            marginBottom: 20,
            opacity: 0.81,
          }}
        ></View>
        <TrainersAboutTrainer trainer={trainer} />
        <View
          style={{
            borderWidth: 0.5,
            borderColor: Colors.LIGHT_GRAY,
            marginTop: 20,
            marginBottom: 20,
            opacity: 0.81,
          }}
        ></View>
        <TrainersPhotos trainer={trainer} />
      </View>
    </>
  );

  const onMessageBtnClick = () => {
    Linking.openURL("sms:+40723853217");
  };
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={[]}
        keyExtractor={(item, index) => index.toString()}
      />
      <View
        style={{
          flexDirection: "row",
          margin: 5,
          padding: 5,
          gap: 8,
          justifyContent: "space-around",marginBottom:20
        }}
      >
        <TouchableOpacity
          style={styles.messageBtn}
          onPress={() => onMessageBtnClick()}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Lato-Regular",
              color: Colors.PRIMARY,
              fontSize: 18,
            }}
          >
            Message
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bookingBtn}
          onPress={() => setShowModal(true)}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Lato-Regular",
              color: Colors.WHITE,
              fontSize: 18,
            }}
          >
            Book now
          </Text>
        </TouchableOpacity>
      </View>
      <Modal animationType="slide" visible={showModal}>
        <TrainersModel
          trainerID={trainer.id}
          hideModal={() => setShowModal(false)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  messageBtn: {
    padding: 12,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 90,
    textAlign: "center",
    flex: 1,
  },
  bookingBtn: {
    padding: 12,
    backgroundColor: Colors.PRIMARY,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 90,
    textAlign: "center",
    flex: 1,
  },
  subContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    flexWrap: "wrap",
    alignItems: "center",
  },
  backBtnContainer: {
    padding: 20,
    position: "absolute",
    zIndex: 10,marginTop:30
  },
  container: {
    padding: 20,
    display: "flex",
    gap: 10,
  },
  name: {
    fontFamily: "Lato-Bold",
    fontSize: 24,
  },
  experienceText: {
    fontFamily: "Lato-Regular",
    fontSize: 16,
    color: Colors.PRIMARY,
    marginRight: 5,
  },
  danceStyles: {
    fontSize: 12,
    fontSize: 15,
    fontFamily: "Lato-Regular",
    padding: 3,
    color: Colors.PRIMARY_DARK,
    backgroundColor: Colors.PRIMARY_OPACITY,
    borderRadius: 4,
    alignSelf: "flex-start",
    paddingHorizontal: 5,
    marginTop: 4,
    marginRight: 4,
  },
  danceStylesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  contactText: {
    fontFamily: "Lato-Regular",
    fontSize: 16,
    color: Colors.LIGHT_GRAY,
    marginTop: 5,
  },
});
