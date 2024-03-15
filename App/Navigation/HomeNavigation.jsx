import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Screens/HomeScreen/HomeScreen'; 
import TrainersByStyleScreen from '../Screens/TrainersByStyle/TrainersByStyleScreen';
import TrainersDetailScreen from '../Screens/TrainersDetailScreen/TrainersDetailScreen';
import Classes from '../Screens/Classes/Classes';
import CalendarScreen from '../Screens/CalendarScreen/CalendarScreen';
import CheckIn from '../Screens/CheckIn/CheckIn';
import SubscriptionsScreen from '../Screens/Subscription/SubscriptionsScreen';
import DescriptionClasses from '../Screens/Classes/DescriptionClasses';
import BookingScreen from '../Screens/BookingScreen/BookingScreen';
import Payment from '../Screens/Subscription/Payment';
const Stack = createStackNavigator();

export default function HomeNavigation() {
  return (
    
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name='home' component={HomeScreen}/>
        <Stack.Screen name='booking' component={BookingScreen}/>
        <Stack.Screen name='trainers-list' component={TrainersByStyleScreen}/>
        <Stack.Screen name='trainers-detail' component={TrainersDetailScreen}/>
        <Stack.Screen name='classes' component={Classes}/>
        <Stack.Screen name='calendar-screen' component={CalendarScreen}/>
        <Stack.Screen name='check-in' component={CheckIn}/>
        <Stack.Screen name='subscriptions' component={SubscriptionsScreen}/>
        <Stack.Screen name="DescriptionClasses" component={DescriptionClasses} />
        <Stack.Screen name="payment" component={Payment} />

    </Stack.Navigator>
  )
}