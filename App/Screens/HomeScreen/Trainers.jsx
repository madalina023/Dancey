import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList} from 'react-native';
import Heading from '../../Components/Heading';
import GlobalAPI from '../../Utils/GlobalAPI';
import TrainersItem from './TrainersItem';

export default function Trainers() {
    const [trainers, setTrainers] = useState([]);
    
    useEffect(() => {
        getTrainers();
    }, []); 

    const getTrainers = () => {
        GlobalAPI.getTrainers().then(resp => {
            console.log(resp);
            if(resp && resp.trainers) { // Check if resp and resp.trainers are not undefined
                setTrainers(resp.trainers);
            } else {
                // Handle the case where resp or resp.trainers is undefined
                console.error('Invalid response from getTrainers:', resp);
                setTrainers([]); // Set to empty array as a fallback
            }
        });
    };

    return (
        <View style={{marginTop:10}}>
            <Heading text={'Trainers'} isViewAll={true}/>

            <FlatList
                data={trainers}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({item, index}) => (
                    <View style={{marginRight:10}}>
                        <TrainersItem trainer={item}/>
                    </View>
                )}
            />
        </View>
    );
}
