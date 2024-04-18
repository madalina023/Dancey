import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import Heading from "../../Components/Heading";
import GlobalAPI from "../../Utils/GlobalAPI";
import TrainersItem from "./TrainersItem";

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);

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
      <Heading text={"Trainers"} isViewAll={true} />

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
    </View>
  );
}
