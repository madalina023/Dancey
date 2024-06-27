import { View, StyleSheet, Image, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import GlobalAPI from "@/utils/GlobalAPI";
import Heading from "./Heading";

export default function Slider() {
  const [slider, setSlider] = useState();
  useEffect(() => {
    getSliders();
  }, []);

  const getSliders = () => {
    GlobalAPI.getSlider().then((resp) => {
      setSlider(resp?.sliders);
    });
  };
  return (
    <View>
      <Heading text={"Our trainers"} />
      <FlatList
        data={slider}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item?.image?.url }}
              style={styles.sliderImage}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontFamily: "Lato-Regular",
    marginBottom: 10,
  },
  sliderImage: {
    width: 200,
    height: 150,
    borderRadius: 15,
    objectFit: "cover",
    marginRight: 20,
  },
});
