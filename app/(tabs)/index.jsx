
import { View, ScrollView, StyleSheet} from "react-native";
import React, { useEffect} from "react";

import { useRouter } from "expo-router";
import Header from "@/components/Header";
import Categories from "@/components/Categories";
import Slider from "@/components/Slider";
import Styles from "@/components/Styles";
import Trainers from "@/components/Trainers";
import { client } from "@/utils/KindeConfig";
export default function Home() {
  const router = useRouter();
 
  useEffect(() => {
    checkUserAuth(); 
  }, []);

  const checkUserAuth = async () => {
    const result = await services.getData("login");
    if (result !== "true") {
      router.replace("/login");
    }
  };

  const handleLogout = async () => {
    const loggedOut = await client.logout();
    if (loggedOut) {
      await services.storeData("login", "false");
      router.replace("/login");
    }
  };
   
          
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView}>
        <Slider />
        <Categories />
        <Styles />
        <Trainers />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 10,
  },
});