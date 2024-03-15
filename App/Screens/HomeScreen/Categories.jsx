import { View, Text , StyleSheet, FlatList, Image, Touchable, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import GlobalAPI from '../../Utils/GlobalAPI'
import Heading from '../../Components/Heading';
import Colors from '../../Utils/Colors';
import { useNavigation } from '@react-navigation/core';
 
export default function Categories() {
    const [categories, setCategories] = useState([]);
    const navigation=useNavigation();
     useEffect(()=>{
        getCategories();

    },[])
    const getCategories = () =>{
        GlobalAPI.getCategories().then(resp=>{
            setCategories(resp?.categories);
        })
    }
  return (
    <View  style={{marginTop:15}}>
     <Heading text={'Categories'} isViewAll={true}/>
     <FlatList
    data={categories}
    numColumns={4}
    renderItem={({ item, index }) => index<=3&& (
        <TouchableOpacity
        style={styles.container}
        onPress={() => {
          if (item?.name === 'Classes') { // Check if the category name is "Classes"
            navigation.push('classes');
          }
          if (item?.name === 'Calendar') { // Check if the category name is "Classes"
            navigation.push('calendar-screen');
          }
          if (item?.name === 'Check-in') { // Check if the category name is "Classes"
            navigation.push('check-in');
          }
          if (item?.name === 'Subscriptions') { // Check if the category name is "Classes"
            navigation.push('subscriptions');
          }
        }}>
        <View style={styles.iconContainer}>
          <Image source={{ uri: item?.icon?.url }} style={{ width: 35, height: 35 }} />
        </View>
        <Text style={{fontFamily:'Lato-Regular', marginTop:5}}>{item?.name}</Text>
      </TouchableOpacity>
    )}
/>

    </View>
  )
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center'
    },
    iconContainer:{
        backgroundColor:Colors.PRIMARY_LIGHT,
        padding:15, 
        borderRadius:50

    }
})