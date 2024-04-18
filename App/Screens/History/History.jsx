import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import GlobalAPI from "../../Utils/GlobalAPI";
import { useUser } from "@clerk/clerk-expo";
import PageHeading from "../../Components/PageHeading";
import Colors from "../../Utils/Colors";

export default function History() {
  const [checkIns, setCheckIns] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchCheckIns = async () => {
      try {
        const userEmail = user.primaryEmailAddress.emailAddress;
        const userCheckIns = await GlobalAPI.getUserCheckIns(userEmail);
        setCheckIns(userCheckIns);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCheckIns();
  }, []);

  return (
    <View style={styles.container}>
      <PageHeading title="History" />
      <FlatList
        data={checkIns}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.row}>
              <Text style={styles.dateText}>Date: {item.date}</Text>
              <Text style={styles.timeText}>
                Time: {item.calendar.startTime} - {item.calendar.endTime}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.eventText}>
                Class:{" "}
                {item.calendar.danceStyles
                  .map((style) => style.name)
                  .join(", ")}
              </Text>
              <Text style={styles.levelText}>Level: {item.calendar.level}</Text>
            </View>
          </View>
        )}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
  },
  list: {
    marginTop: 20,
  },
  itemContainer: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    color: Colors.BLACK,
  },
  eventText: {
    fontSize: 16,
    color: Colors.BLACK,
  },
  levelText: {
    fontSize: 14,
    color: Colors.PRIMARY,
  },
  timeText: {
    fontSize: 14,
    color: Colors.PRIMARY,
  },
});
