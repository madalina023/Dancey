import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/core";
import GlobalAPI from "@/utils/GlobalAPI";
import TrainerListItem from "@/components/TrainerListItem";
import Colors from "@/constants/Colors";
import PageHeading from "@/components/PageHeading";
export default function TrainersByStyleScreen() {
  const parameters = useRoute().params;
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
    <View style={{ padding: 20, paddingTop: 20,marginTop:30 }}>
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
        } 
      />
    </View>
  );
}
