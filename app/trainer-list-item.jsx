import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import Colors from "@/constants/Colors";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import { AntDesign } from "@expo/vector-icons";

export default function TrainerListItem({
  trainer,
  booking,
  onCancel,
  isBookingPage,
}) {
  const navigation = useNavigation();
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const getStatusBackgroundColor = (status) => {
    switch (status) {
      case "Completed":
        return Colors.GREEN_LIGHT;
      case "In Progress":
        return Colors.ORANGE_LIGHT; 
      case "Booked":
        return Colors.PRIMARY_OPACITY;
      default:
        return Colors.GRAY; 
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
            navigation.push("/trainer-detail", { trainer: trainer });
          }
        }}
        disabled={isBookingPage} 
      >
        <View style={styles.imageAndBtncontainer}>
          <Image
            source={{ uri: trainer?.images[0]?.url }}
            style={styles.image}
          />
          {isBookingPage && (
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.subcontainer}> 
            <Text style={styles.name}>{trainer.name}</Text>
 
            {!showBookingDetails && (
              <>
                <Text style={styles.experience}>
                  {trainer.experience} experience
                </Text>
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
  toggleBookingContainer: {
    alignSelf: "flex-end", 
  },
  cancelButton: {
   
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButtonText: {
    color: "white",
    textAlign: "center",
  },
  toggleBooking: {
    fontFamily: "Lato-Regular",
    color: Colors.PRIMARY,
    marginTop: 10,
    alignSelf: "flex-end",
    paddingHorizontal: 10,
  },
  booked: {
    fontFamily: "Lato-Regular",
    fontSize: 14,
    color: Colors.PRIMARY,
    alignSelf: "flex-start",
    marginTop: 10,
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    borderRadius: 8,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center", 
    marginTop: 10, 
  },
  dateText: {
    marginLeft: 8, 
    fontSize: 15,
    color: Colors.GRAY, 
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
    justifyContent: "space-between",
  },
  subcontainer: {
    flexDirection: "column",
    overflow: "hidden",
  },
  image: {
    width: 100,
    height: 100,
    objectFit: "cover",
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
  }
});
