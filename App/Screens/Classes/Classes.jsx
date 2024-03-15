import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import GlobalAPI from '../../Utils/GlobalAPI';
// import Heading from '../../Components/Heading'; // Assuming you have this component
import Colors from '../../Utils/Colors';
import { useNavigation } from '@react-navigation/core';
import { Ionicons } from "@expo/vector-icons";

export default function Styles({ searchQuery = '' }) {
    const [danceStyles, setDanceStyles] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        getDanceStyles();
    }, [searchQuery]);

    const getDanceStyles = () => {
        GlobalAPI.getDanceStyle().then(resp => {
            const filteredStyles = resp?.danceStyles.filter(style =>
                style.name.toLowerCase().includes(searchQuery.toLowerCase())
            ) || [];
            setDanceStyles(filteredStyles);
        }).catch(error => {
            console.error("Error fetching styles:", error);
        });
    };

    return (
        <View style={{ marginTop: 15 }}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.backBtnContainer}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={Colors.BLACK} />
                </TouchableOpacity>
                {/* Replace Heading component with Text if you're not using a custom component */}
                <Text style={styles.headerTitle}>Classes</Text> 
            </View>
            <FlatList
                data={danceStyles}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.imageStylesContainer}
                        onPress={() => navigation.navigate('DescriptionClasses', {
                            styleName: item.name,
                            imageUrl: item.icon.url,
                            description: item.description,
                          })}>
                        <Image source={{ uri: item?.icon?.url }} style={styles.stylesContainer} />
                        <Text style={styles.styleName}>{item?.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    imageStylesContainer: {
        flexDirection: 'row', // Adjusted for vertical layout
        alignItems: 'center',
        margin: 10, // Adjust spacing as needed for vertical layout
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        padding: 10,
    },
    stylesContainer: {
        width: 50,  // Adjust size as needed
        height: 50,  // Adjust size as needed
        borderRadius: 25,
        marginRight: 10, // Spacing between image and text
    },
    styleName: {
        fontFamily: 'Lato-Regular',
        fontSize: 16,
        color: Colors.BLACK,
    },
    backBtnContainer: {
        marginRight:10
    },
    headerContainer: {
        flexDirection: 'row', // Aligns items horizontally
        alignItems: 'center', // Centers items vertically in the container
        marginBottom: 15, 
        marginLeft:15// Adds some space below the header
    },   headerTitle: {
        fontSize: 20,
        color: Colors.BLACK, // Adjust as needed
        fontWeight: 'bold',
    },
});
