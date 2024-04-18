import { View, Text, FlatList, Image } from 'react-native'
import React from 'react'
import Heading from '../../Components/Heading'

export default function TrainersPhotos({trainer}) {
  return (
    <View>
      <Heading text={'Photos'}/>
      <FlatList
        data={trainer.images}
        numColumns={2}
        renderItem={({item})=>(
        <Image source={{uri:item.url}}
            style={{width:'100%',height:120, flex:1, borderRadius:10, margin:7, objectFit:'contain'}}/>
        )}/>
    </View>
  )
}