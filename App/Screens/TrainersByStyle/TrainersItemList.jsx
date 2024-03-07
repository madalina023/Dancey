import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../../Utils/Colors';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
 import { Entypo } from '@expo/vector-icons';
export default function TrainerListItem({ trainer, booking }) {
    const navigation=useNavigation();
    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.content} 
                onPress={() => navigation.push('trainers-detail', {
                    trainer: trainer  
                  })
                      
                }   >
                <Image source={{ uri: trainer?.images[0]?.url }} style={styles.image} />
                <View style={styles.subcontainer}>
                    <Text style={styles.experience}>{trainer.experience}</Text>                    
                     <Text style={styles.name}>{trainer.name}</Text>
                     <Text style={styles.contact}>
                     <Entypo name="phone" size={24} color={Colors.PRIMARY} />
                     {trainer.contact}</Text>
                  
                     {booking?.id? <Text style={{
                        marginTop:10, 
                        fontFamily:'Lato-Regular', 
                        color:Colors.PRIMARY, 
                        elevation:10}}>Show booking</Text>:null}
                </View>
                <AntDesign name="right" size={24}   color={Colors.PRIMARY_DARK} />
            
            </TouchableOpacity>
           
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        marginBottom: 15,
        padding: 10,
        marginTop: 15,
        flexDirection: 'row', // Make sure the main container is row-oriented
        alignItems: 'center', // Center items vertically in the container
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Ensure space distribution between items
        flex: 1, // Take up all available space
    },
    subcontainer: {
        flexDirection: 'column', // Stack the text items vertically
        justifyContent: 'center', // Center the items if there is vertical space
        flex: 1, // Allow this container to expand, pushing the icon to the edge
        marginLeft: 10, // Keep some space between the image and text
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    contact: {
        fontFamily: 'Lato-Regular',
        fontSize: 15,
        color: Colors.GRAY,
        flexDirection: 'row', // If you're mixing text and icons, ensure proper alignment
        alignItems: 'center', // Align text and icon vertically
    },
    name: {
        fontFamily: 'Lato-Bold',
        fontSize: 19,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    experience: {
        fontFamily: 'Lato-Regular',
        fontSize: 14,
        color: Colors.LIGHT_GRAY,
    },
});
