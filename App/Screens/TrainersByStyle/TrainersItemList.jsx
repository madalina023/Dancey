import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Colors from "../../Utils/Colors";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import { AntDesign } from "@expo/vector-icons";

export default function TrainerListItem({ trainer, booking, isBookingPage }) {
  const navigation = useNavigation();
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const getStatusBackgroundColor = (status) => {
    switch (status) {
      case "Completed":
        return Colors.GREEN_LIGHT; // Ensure Colors.GREEN is defined in your Colors file
      case "InProgress":
        return Colors.ORANGE_LIGHT; // Ensure Colors.RED is defined in your Colors file
      case "Booked":
        return Colors.PRIMARY_OPACITY;
      default:
        return Colors.GRAY; // A default color for unknown statuses
    }
  };

  if (!trainer) {
    return (
      <View style={styles.container}>
        <Text>Trainer information is unavailable.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.content}
        onPress={() => {
          if (!isBookingPage) {
            navigation.push("trainers-detail", { trainer: trainer });
          }
        }}
      >
        <Image source={{ uri: trainer?.images[0]?.url }} style={styles.image} />
        <View style={styles.infoContainer}>
          <View style={styles.subcontainer}>
            {/* Name is always displayed */}
            <Text style={styles.name}>{trainer.name}</Text>

            {/* Experience and contact are conditionally rendered based on showBookingDetails */}
            {!showBookingDetails && (
              <>
                <Text style={styles.experience}>{trainer.experience}</Text>
                <Text style={styles.contact}>
                  <Entypo name="phone" size={18} color={Colors.PRIMARY} />
                  {trainer.contact}
                </Text>
              </>
            )}
            {isBookingPage && showBookingDetails && (
              <>
                <View
                  style={[
                    styles.booked,
                    {
                      backgroundColor: getStatusBackgroundColor(
                        booking?.bookingStatus || "Unknown"
                      ),
                    },
                  ]}
                >
                  <Text style={styles.bookedText}>
                    Status: {booking?.bookingStatus || "Unavailable"}
                  </Text>
                </View>

                <View style={styles.dateContainer}>
                  <AntDesign name="calendar" size={24} color={Colors.PRIMARY} />
                  <Text style={styles.dateText}>
                    {booking?.date} at {booking?.time}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setShowBookingDetails(false)}>
                  <Text style={styles.toggleBooking}>Hide booking</Text>
                </TouchableOpacity>
              </>
            )}
            {isBookingPage && !showBookingDetails && booking?.id && (
              <TouchableOpacity onPress={() => setShowBookingDetails(true)}>
                <Text style={styles.toggleBooking}>Show booking</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  toggleBooking: {
    fontFamily: "Lato-Regular",
    color: Colors.PRIMARY,
    marginTop: 10,
  },
  booked: {
    fontFamily: "Lato-Regular",
    fontSize: 14,
    color: Colors.PRIMARY,
    alignSelf: "flex-start",
    marginTop: 10,
    paddingVertical: 5, // Add vertical padding
    paddingHorizontal: 10, // Add horizontal padding to make the background more visible
    borderRadius: 8, // Adjust this value to increase or decrease the roundness of the corners
    // Dynamic background color is applied inline as shown previously
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center", // This aligns items vertically within the container
    marginTop: 10, // Adjust spacing as needed
  },
  dateText: {
    marginLeft: 8, // Space between icon and text
    fontFamily: "Lato-Regular", // Use your font
    fontSize: 15,
    color: Colors.GRAY, // Adjust color as needed
  },
  container: {
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    marginBottom: 15,
    padding: 10,
    marginTop: 15,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "space-between", // Adjust spacing between components
  },
  subcontainer: {
    flexDirection: "column",
    overflow: "hidden",
  },
  image: {
    width: 100,
    height: 100,
    objectFit:'cover',
    borderRadius: 10,
  },
  contact: {
    fontFamily: "Lato-Regular",
    fontSize: 15,
    marginTop: 8,
    color: Colors.GRAY,
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontFamily: "Lato-Bold",
    fontSize: 19,
    fontWeight: "bold",
    marginVertical: 5,
  },
  experience: {
    fontFamily: "Lato-Regular",
    fontSize: 14,
    paddingTop: 7,
    color: Colors.LIGHT_GRAY,
  },
  // Add or adjust other styles as needed
});
