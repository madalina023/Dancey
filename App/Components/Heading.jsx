import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function Heading({text, isViewAll=false}) {
  return (
    <View style={styles.container}>
       <Text style={styles.heading}>{text}</Text>
       {isViewAll&& <Text> View all</Text>}
    </View>
  )
}
const styles = StyleSheet.create({
    container:{
        display: 'flex',
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    heading: {
        fontSize: 18,
        fontFamily: 'Lato-Bold',
        marginBottom:15
    }
})
