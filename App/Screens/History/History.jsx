import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import GlobalAPI from "../../Utils/GlobalAPI";
import { useUser } from "@clerk/clerk-expo";
import PageHeading from "../../Components/PageHeading";
import Colors from "../../Utils/Colors";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

export default function History() {
  const [checkIns, setCheckIns] = useState([]);
  const { user } = useUser();

  // Level mapping from current level to the next level
  const nextLevelMapping = {
    Beginner: "Intermediate",
    Intermediate: "Advanced",
  };

  useEffect(() => {
    async function fetchAndCheckCheckIns() {
      try {
        const userEmail = user.primaryEmailAddress.emailAddress;
        const userCheckIns = await GlobalAPI.getUserCheckIns(userEmail);
        setCheckIns(userCheckIns);
        checkLevelCounts(userCheckIns);
      } catch (error) {
        console.error("Failed to fetch check-ins:", error);
      }
    }

    fetchAndCheckCheckIns();
  }, []);

  const checkLevelCounts = async (checkIns) => {
    const levelCounts = checkIns.reduce((acc, item) => {
      const level = item.calendar.level;
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});

    Object.keys(levelCounts).forEach((level) => {
      if (levelCounts[level] > 1 && nextLevelMapping[level]) {
        sendNotification(
          `You are ready to go to the next level - ${nextLevelMapping[level]}.`
        );
      }
    });
  };

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true, // Show alert even when app is in foreground
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  async function sendNotification(message) {
    console.log("Sending notification with message:", message);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "It is time to advance to the next level!",
        body: message,
      },
      trigger: null, // Instant notification
    });
  }

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
