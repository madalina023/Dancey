import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import GlobalAPI from "../../Utils/GlobalAPI";
import { useUser } from "@clerk/clerk-expo";
import TrainersItemList from "../TrainersByStyle/TrainersItemList";
export default function BookingScreen() {
  const { user } = useUser();
  const [bookingList, setBookingList] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (user) {
      getUserBookings();
    }
  }, [user]);

  const getUserBookings = () => {
    setLoading(true);
    GlobalAPI.getUserBookings(user.primaryEmailAddress.emailAddress)
      .then((response) => {
        console.log("API response:", response);
        if (response && response.bookings) {
          setBookingList(response.bookings);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch booking list:", error);
      });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontFamily: "Lato-Bold", fontSize: 24 }}>My bookings</Text>
      <FlatList
        data={bookingList}
        onRefresh={()=>getUserBookings()}
        refreshing={loading}
        renderItem={({ item }) => {
          // Pass isBookingPage prop as true
          return (
            <TrainersItemList
              trainer={item?.trainer}
              booking={item}
              isBookingPage={true}
            />
          );
        }}
      />
    </View>
  );
}
