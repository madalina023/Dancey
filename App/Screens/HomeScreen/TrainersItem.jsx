import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '../../Utils/Colors';

export default function TrainersItem({trainer}) {
    return (
      <View style={styles.container}>
        <Image source={{uri: trainer.images[0]?.url}}
               style={styles.image}/>
        <View>
        <Text style={{fontSize: 16, fontFamily: 'Lato-Bold', marginTop:5}}>{trainer?.name}</Text>                
        <View style={styles.danceStylesContainer}>
        {trainer?.danceStyles?.map((style, index) => (
            <Text key={index} 
            style={styles.danceStyles}>{style.name}
            </Text>
        ))}
        </View>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container:{
     padding:10,
     borderRadius:10,
     backgroundColor:Colors.PRIMARY_LIGHT        
    },  
    image: {
      width: 150,
      height: 180,
      borderRadius: 10,objectFit:'cover',
    },
    danceStyles:{fontSize: 12, 
      fontSize: 12, 
      fontFamily: 'Lato-Regular',
      padding: 2,
      color: Colors.PRIMARY_DARK,
      backgroundColor: Colors.PRIMARY_OPACITY,
      borderRadius: 4,
      alignSelf: 'flex-start',
      paddingHorizontal: 5,
      marginTop: 4,  marginRight:4
    },
    danceStylesContainer:{
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        marginTop: 4
    }
  }); 