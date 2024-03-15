import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import Colors from '../../Utils/Colors';
import { useNavigation } from '@react-navigation/core';

const DescriptionClasses = ({ route }) => {
  const { styleName, imageUrl, description } = route.params;
  const navigation = useNavigation();
  const[isReadMore,setIsReadMore]=useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.BLACK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{styleName}</Text>
      </View>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.aboutTitle}>About {styleName}</Text>
      <View style={styles.descriptionContainer}>
        <Text numberOfLines={isReadMore?20:3} style={styles.description}>{description}</Text>
        <TouchableOpacity onPress={()=>setIsReadMore(!isReadMore)}>
            <Text style={{color:Colors.PRIMARY, fontSize:16, fontFamily:'Lato-Regular'}}>{isReadMore?'Read less':'Read more'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.BLACK,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  aboutTitle: {
    alignSelf: 'flex-start',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.BLACK,
    marginBottom: 10,
  },
   
  description: {
    lineHeight:28, fontFamily:'Lato-Bold', fontSize:16, color:Colors.GRAY
    },
    
});

export default DescriptionClasses;
