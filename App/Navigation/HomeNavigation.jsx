import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Screens/HomeScreen/HomeScreen'; 
import TrainersByStyleScreen from '../Screens/TrainersByStyle/TrainersByStyleScreen';
import TrainersDetailScreen from '../Screens/TrainersDetailScreen/TrainersDetailScreen';
const Stack = createStackNavigator();

export default function HomeNavigation() {
  return (
    
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name='home' component={HomeScreen}/>
        <Stack.Screen name='trainers-list' component={TrainersByStyleScreen}/>
        <Stack.Screen name='trainers-detail' component={TrainersDetailScreen}/>
    </Stack.Navigator>
  )
}