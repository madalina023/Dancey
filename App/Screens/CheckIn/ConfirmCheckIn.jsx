import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import { View, Text, TouchableOpacity, StyleSheet, Button } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Colors from "../../Utils/Colors";
import GlobalAPI from "../../Utils/GlobalAPI"; 
import { Alert } from "react-native";
function ConfirmCheckInPage({ navigation }) { const { user } = useUser();
 
   const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState();
useEffect(() => {
  const fetchData = async () => {
    try {
      const eventsToday = await GlobalAPI.getCalendarEventsWithDetails();
      console.log("Fetched events:", eventsToday);

      const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const todayDayOfWeek = dayNames[new Date().getDay()]; // This will give you the full day name

      const filteredEvents = eventsToday.filter(
        (event) => event.dayOfWeek === todayDayOfWeek // Use the full string name to filter
      );

      console.log("Today's day of the week:", todayDayOfWeek);
      console.log("Events fetched:", eventsToday);
      console.log("Filtered events:", filteredEvents);

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

    const userName = user.firstName + " " + user.lastName;
    const userEmail = user.primaryEmailAddress.emailAddress;
    const currentDate = new Date().toISOString().split("T")[0]; // Formats to "YYYY-MM-DD"

    // Check if the user is already checked in for the selected event
    const isCheckedIn = await GlobalAPI.checkUserCheckIn(
      selectedEvent,
      currentDate,
      userEmail
    );

    if (isCheckedIn) {
      Alert.alert(
        "Check-In Error",
        "You are already checked in for this event today.",
         [
            {
              text: "OK",
              onPress: () => navigation.navigate("home"), // Replace 'Home' with the actual route name of your home page
            },
          ]
      );
    } else {
      try {
        // Make sure you are passing just the selected event's ID, not an object
        const checkInData = await GlobalAPI.checkInForClass(
          userName,
          userEmail,
          selectedEvent, // Assuming this is just the ID string, not an object
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
              onPress: () => navigation.navigate("home"), // Replace 'Home' with the actual route name of your home page
            },
          ]
        );
      } catch (error) {
        console.error("Failed to check in:", error);
        Alert.alert("Check-In Error", "Failed to check in. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ margin: 10 }}>QR Code validated! Check-In Confirmed.</Text>
      {user && (
        <View>
          <Text>Welcome, {user.firstName} {user.lastName}</Text> 
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
    backgroundColor: "#f9f9f9", // Light background color
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12, // Increased padding for a bigger button
    paddingHorizontal: 30,
    borderRadius: 25, // Rounded corners
    marginTop: 20,
    shadowColor: "#000", // Shadow for depth
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
    fontSize: 16, // Larger font size
    fontWeight: "bold", // Bold font weight
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16, // Increased font size
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
    backgroundColor: "white", // Background color for the picker
    marginTop: 10, // Add space above the picker
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
  // Include icon container for better alignment if necessary
  iconContainer: {
    top: 5,
    right: 15,
  },
});

export default ConfirmCheckInPage;
