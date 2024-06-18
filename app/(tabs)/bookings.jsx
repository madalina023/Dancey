import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import GlobalAPI from "@/utils/GlobalAPI";
import { useUser } from "@clerk/clerk-expo";
import TrainerListItem from "@/components/TrainerListItem";
import Colors from "@/constants/Colors";
import { useIsFocused } from "@react-navigation/native";
import { client } from "@/utils/KindeConfig";

export default function BookingScreen() {
   const [user, setUser] = useState();
   useEffect(() => {
     getUserData();
   }, []);
   const getUserData = async () => {
     const user = await client.getUserDetails();
     setUser(user);
   };
  const [bookingList, setBookingList] = useState([]);
  const [loading, setLoading] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => { 
    if (user && isFocused) {
      fetchAndUpdateBookings();
    }
  }, [user, isFocused]);
 
  const parseDateTimeFromString = (dateStr, timeStr) => {
    const months = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };

    const dateParts = dateStr.split("-");
    const timeParts = timeStr.split(/[:\s]/); 

    if (dateParts.length === 3 && timeParts.length >= 2) {
      const year = dateParts[2];
      const month = months[dateParts[1]];
      const day = dateParts[0].length === 1 ? `0${dateParts[0]}` : dateParts[0];
      let hour = parseInt(timeParts[0], 10);
      const minutes = timeParts[1];

      // Adjust for AM/PM if necessary
      if (
        timeParts.length === 4 &&
        timeParts[3].toLowerCase() === "pm" &&
        hour < 12
      ) {
        hour += 12;
      } else if (
        timeParts.length === 4 &&
        timeParts[3].toLowerCase() === "am" &&
        hour === 12
      ) {
        hour = 0;
      }

      const formattedDateTimeStr = `${year}-${month}-${day}T${hour}:${minutes}:00`;
      return new Date(formattedDateTimeStr);
    }

    throw new Error("Invalid date or time string format");
  };
 
  const isBookingInProgress = (bookingDate, currentTime) => {
    const startTime = bookingDate;
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); 
    return currentTime >= startTime && currentTime < endTime;
  };

 
  const getUserBookings = async () => {
    if (user?.email) {
      const response = await GlobalAPI.getUserBookings(
        user.email
      );
      console.log("Response from server:", response);  
      return response;
    }
  };
  const fetchAndUpdateBookings = async () => {
    setLoading(true);
    try {
      const response = await getUserBookings();
      let now = new Date();
      console.log("Fetched bookings:", response.bookings || []); 
      setBookingList(response.bookings); 
      const updatedBookings = response.bookings.map((booking) => {
        const bookingDateTime = parseDateTimeFromString(
          booking.date,
          booking.time
        );

         if (isBookingInProgress(bookingDateTime, now)) {
          return { ...booking, bookingStatus: "In Progress" };
        }
         else if (
          bookingDateTime < now &&
          booking.bookingStatus !== "Completed"
        ) {
          return { ...booking, bookingStatus: "Completed" };
        } else {
          return booking;  
        }
      });

      
      setBookingList(updatedBookings);
    } catch (error) {
      console.error("Error during booking update/fetch:", error);
    } finally {
      setLoading(false);
    }
  };
  const cancelBooking = async (bookingId) => {
    try {
      await GlobalAPI.cancelBooking(bookingId);  
      Alert.alert(
        "Booking Canceled",
        "Your booking has been successfully canceled."
      );
      fetchAndUpdateBookings(); 
    } catch (error) {
      console.error("Error canceling booking:", error);
      Alert.alert("Cancellation Error", "Failed to cancel booking.");
    }
  };
 
  return (
    <View style={{ padding: 20, margintop: 30 }}>
      <Text
        style={{
          marginTop: 20,
          paddingTop: 10,
           
          fontFamily: "Lato-Bold",
          fontSize: 26, 
          color: Colors.BLACK,
        }}
      >
        My bookings
      </Text>
      <FlatList
        data={bookingList}
        onRefresh={fetchAndUpdateBookings}
        refreshing={loading}
        renderItem={({ item }) => (
          <TrainerListItem
            trainer={item?.trainer}
            booking={item}
            onCancel={() => {
              Alert.alert(
                "Cancel Booking",
                "Are you sure you want to cancel this booking?",
                [
                  { text: "No" },
                  {
                    text: "Yes",
                    onPress: () => cancelBooking(item.id),
                  },
                ]
              );
            }}
            isBookingPage={true}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
