import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import GlobalAPI from '../../Utils/GlobalAPI'
import { useUser } from '@clerk/clerk-expo'
import TrainersItemList from '../TrainersByStyle/TrainersItemList'
export default function BookingScreen() {
  const { user } = useUser();
  const [bookingList, setBookingList] = useState([]);

  useEffect(() => {
    if (user) {
      getUserBookings();
    }
  }, [user]);
  
  const getUserBookings = () => {
    GlobalAPI.getUserBookings(user.primaryEmailAddress.emailAddress)
    .then(response => {
      console.log('API response:', response);
      // Assuming response is the object containing the "bookings" array as shown in the log
      if (response && response.bookings) {
        setBookingList(response.bookings);
      }
    })
    .catch(error => {
      console.error('Failed to fetch booking list:', error);
    });
  };
  
  
  

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontFamily: 'Lato-Bold', fontSize: 24 }}>My bookings</Text>
      <FlatList
        data={bookingList}
        renderItem={({ item }) => {
          console.log('Rendering item:', item);
          return <TrainersItemList trainer={item?.trainer}  
          booking={item}/>;
        }}
        
      />
    </View>
  );
}
