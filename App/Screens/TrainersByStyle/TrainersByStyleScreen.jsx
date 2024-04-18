import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/core";
import { Ionicons } from "@expo/vector-icons";
import GlobalAPI from "../../Utils/GlobalAPI";
import TrainerListItem from "./TrainersItemList";
import Colors from "../../Utils/Colors";
import PageHeading from "../../Components/PageHeading";
export default function TrainersByStyleScreen() {
  const parameters = useRoute().params;
  const navigation = useNavigation();
  const [trainerList, setTrainerList] = useState([]);
  useEffect(() => {
    parameters && getTrainersByStyle();
  }, [parameters]);

  const getTrainersByStyle = () => {
    GlobalAPI.getTrainersListByStyle(parameters.danceStyles).then((resp) => {
      setTrainerList(resp.trainers);
    });
  };
  return (
    <View style={{ padding: 20, paddingTop: 20 }}>
      <PageHeading title={parameters.danceStyles} />
      <FlatList
        data={trainerList}
        renderItem={({ item, index }) => <TrainerListItem trainer={item} />}
        ListEmptyComponent={
          <Text
            style={{
              fontFamily: "Lato-Regular",
              fontSize: 22,
              textAlign: "center",
              marginTop: 30,
              color: Colors.LIGHT_GRAY,
            }}
          >
            No trainer found
          </Text>
        } // This will show when trainerList is empty
      />
    </View>
  );
}
