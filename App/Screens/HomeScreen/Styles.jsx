import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import GlobalAPI from '../../Utils/GlobalAPI';
import Heading from '../../Components/Heading';
import Colors from '../../Utils/Colors';
import { useNavigation } from '@react-navigation/core';

export default function Styles() {
    const [danceStyles, setDanceStyles] = useState([]);
    const navigation=useNavigation();
    useEffect(() => {
        getDanceStyles();
    }, []);

    const getDanceStyles = () => {
        GlobalAPI.getDanceStyle().then(resp => {
            setDanceStyles(resp?.danceStyles || []);
        }).catch(error => {
            console.error("Error fetching styles:", error);
        });
    };

    return (
        <View style={{ marginTop: 15 }}>
            <Heading text={'Styles'} />
            <FlatList
                data={danceStyles}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <TouchableOpacity style={styles.imageStylesContainer}
                    onPress={()=>navigation.push('trainers-list',{
                        danceStyles:item.name
                    })}>
                        <Image source={{ uri: item?.icon?.url }} style={styles.stylesContainer} />
                        <Text style={{ fontFamily: 'Lato-Regular', marginTop: 5 }}>{item?.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    imageStylesContainer:{
        flex: 1,
        alignItems: 'center',
        marginTop:20
    },
    stylesContainer: {
        width: 100,  
        height: 100,  
        borderRadius: 25 
    }
});
