import { View, Text, Image, StyleSheet, Touchable } from "react-native";
import React from "react";
import Colors from "../../Utils/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/core";
export default function TrainersItem({ trainer, onSelect }) {
  const navigation = useNavigation();

const handlePress = () => {
  
  if (onSelect) {
    onSelect(); // This will close the modal
  }
  navigation.push("trainers-detail", {
    trainer: trainer,
  });
};


  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image source={{ uri: trainer.images[0]?.url }} style={styles.image} />
      <View>
        <Text style={{ fontSize: 16, fontFamily: "Lato-Bold", marginTop: 5 }}>
          {trainer?.name}
        </Text>
        <View style={styles.danceStylesContainer}>
          {trainer?.danceStyles?.map((style, index) => (
            <Text key={index} style={styles.danceStyles}>
              {style.name}
            </Text>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.WHITE,
  },
  image: {
    width: 150,
    height: 180,
    borderRadius: 10,
    objectFit: "cover",
  },
  danceStyles: {
    fontSize: 12,
    fontSize: 12,
    fontFamily: "Lato-Regular",
    padding: 2,
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
});
