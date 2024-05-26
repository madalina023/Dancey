import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import GlobalAPI from "@/utils/GlobalAPI";
import PageHeading from "@/components/PageHeading";
import Colors from "@/constants/Colors";
import { client } from "@/utils/KindeConfig";

export default function History() {
  const [checkIns, setCheckIns] = useState([]);
  const [user, setUser] = useState(null);
  const [remainingSessions, setRemainingSessions] = useState(0);

  useEffect(() => {
    const getUserData = async () => {
      const user = await client.getUserDetails();
      setUser(user);
    };
    getUserData();
  }, []);

  useEffect(() => {
    const fetchAndCheckCheckIns = async () => {
      if (user) {
        try {
          const userEmail = user.email;
          const userCheckIns = await GlobalAPI.getUserCheckIns(userEmail);
          setCheckIns(userCheckIns);

          console.log("User Check-Ins:", userCheckIns); // Debugging statement

          // Fetch subscription details
          const subscriptionDetails = await GlobalAPI.getActiveSubscription(
            userEmail
          );
          console.log("Subscription Details:", subscriptionDetails); // Debugging statement

          if (
            subscriptionDetails.activeSubscriptions &&
            subscriptionDetails.activeSubscriptions.length > 0
          ) {
            const activeSubscription =
              subscriptionDetails.activeSubscriptions[0];
            const { subscriptions, date: subscriptionStartDate } =
              activeSubscription;
            const totalSessions = subscriptions[0].name.includes("12")
              ? 12
              : subscriptions[0].name.includes("8")
              ? 8
              : subscriptions[0].name.includes("4")
              ? 4
              : 0;

            console.log("Total Sessions:", totalSessions); // Debugging statement
            console.log("Subscription Start Date:", subscriptionStartDate); // Debugging statement

            // Filter check-ins that occurred after the subscription start date
            const relevantCheckIns = userCheckIns.filter(
              (checkIn) =>
                new Date(checkIn.date) >= new Date(subscriptionStartDate)
            );
            console.log("Relevant Check-Ins:", relevantCheckIns); // Debugging statement

            const remaining = totalSessions - relevantCheckIns.length;
            setRemainingSessions(remaining);
          } else {
            console.warn("No active subscription found for user.");
          }
        } catch (error) {
          console.error(
            "Failed to fetch check-ins or subscription details:",
            error
          );
        }
      }
    };

    fetchAndCheckCheckIns();
  }, [user]);
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
      <View style={styles.footer}>
        <Text style={styles.remainingText}>
          You have {remainingSessions} sessions remaining.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
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
  footer: {
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    alignItems: "center",
  },
  remainingText: {
    fontSize: 16,
    color: Colors.BLACK,
  },
});
