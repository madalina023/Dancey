import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useNavigation } from "@react-navigation/native";
import Colors from "@/constants/Colors";
import GlobalAPI from "@/utils/GlobalAPI";
import { client } from "@/utils/KindeConfig";

function ConfirmCheckInPage() {
  const navigation = useNavigation();
  const [user, setUser] = useState();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState();

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const user = await client.getUserDetails();
    setUser(user);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsToday = await GlobalAPI.getCalendarEventsWithDetails();

        const dayNames = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const todayDayOfWeek = dayNames[new Date().getDay()]; 

        const filteredEvents = eventsToday.filter(
          (event) => event.dayOfWeek === todayDayOfWeek 
        );

        setEvents(filteredEvents);
      } catch (error) {
        console.error("Failed to load events", error);
      }
    };

    fetchData();
  }, []);
  const handleConfirmCheckIn = async () => {
    if (!selectedEvent) {
      alert("Please select an event to check in.");
      return;
    }
    if (!user) {
      alert("No user is currently signed in.");
      return;
    }

    const userName = user.given_name + " " + user.family_name;
    const userEmail = user.email;
    const currentDate = new Date().toISOString().split("T")[0]; 

    try {
      const checkedInEvents = await GlobalAPI.getUserCheckIns(userEmail);

      const selectedEventDetails = events.find(
        (event) => event.id === selectedEvent
      );
      const selectedEventStart = new Date(
        `${currentDate}T${selectedEventDetails.startTime}`
      );
      const selectedEventEnd = new Date(
        `${currentDate}T${selectedEventDetails.endTime}`
      );

      let isSameEventToday = false;
      let isOverlap = false;

      checkedInEvents.forEach((event) => {
        const eventStart = new Date(
          `${event.date}T${event.calendar.startTime}`
        );
        const eventEnd = new Date(`${event.date}T${event.calendar.endTime}`);

        if (selectedEvent === event.calendar.id && currentDate === event.date) {
          isSameEventToday = true;
        }

        if (selectedEventStart < eventEnd && selectedEventEnd > eventStart) {
          isOverlap = true;
        }
      });

      if (isSameEventToday) {
        Alert.alert(
          "Check-In Error",
          "You are already checked in for this event today.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("index"), 
            },
          ]
        );
        return;
      }

      if (isOverlap) {
        Alert.alert(
          "Check-In Error",
          "You are already checked in for another event at the same time.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("index"), 
            },
          ]
        );
        return;
      }

      try {
     
        const checkInData = await GlobalAPI.checkInForClass(
          userName,
          userEmail,
          selectedEvent,
          currentDate
        );
        Alert.alert(
          "Check-in successful",
          `You have checked in to: ${checkInData.calendar.danceStyles
            .map((ds) => ds.name)
            .join(", ")} - Level: ${checkInData.calendar.level}`,
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("index"),
            },
          ]
        );
      } catch (error) {
        console.error("Failed to check in:", error);
        Alert.alert("Check-In Error", "Failed to check in. Please try again.");
      }
    } catch (error) {
      console.error("Failed to fetch user check-ins or check-in:", error);
      Alert.alert("Check-In Error", "Failed to check in. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ margin: 10 }}>QR Code validated! Check-In Confirmed.</Text>
      {user && (
        <View>
          <Text>
            Welcome, {user.firstName} {user.lastName}
          </Text>
        </View>
      )}
      <RNPickerSelect
        onValueChange={(value) => setSelectedEvent(value)}
        items={events.map((event) => ({
          label: `${event.danceStyles.map((style) => style.name).join(", ")}: ${
            event.startTime
          } - ${event.endTime} , ${event.level}`,
          value: event.id,
        }))}
        placeholder={{ label: "Select a course...", value: null }}
        style={pickerSelectStyles}
        useNativeAndroidPickerStyle={false}
      />

      <TouchableOpacity style={styles.button} onPress={handleConfirmCheckIn}>
        <Text style={styles.buttonText}>Confirm Style</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9", 
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12, 
    paddingHorizontal: 30,
    borderRadius: 25, 
    marginTop: 20,
    shadowColor: "#000", 
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16, 
    fontWeight: "bold", 
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
    backgroundColor: "white", 
    marginTop: 10, 
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
    backgroundColor: "white",
    marginTop: 10,
  },
  iconContainer: {
    top: 5,
    right: 15,
  },
});

export default ConfirmCheckInPage;
