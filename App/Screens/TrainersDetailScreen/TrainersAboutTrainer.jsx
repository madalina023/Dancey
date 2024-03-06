import { View, Text, StyleSheet , TouchableOpacity} from 'react-native'
import React, { useState } from 'react';
import Heading from '../../Components/Heading';
import Colors from '../../Utils/Colors';

export default function TrainersAboutTrainer({trainer}) {
    const[isReadMore,setIsReadMore]=useState(false);
  return trainer&& (
    <View>
        <Heading text={'About trainer'}/>
        <Text numberOfLines={isReadMore?20:5} style={{ lineHeight:28, fontFamily:'Lato-Bold', fontSize:16, color:Colors.GRAY}}>{trainer.about}</Text>
        <TouchableOpacity onPress={()=>setIsReadMore(!isReadMore)}>
            <Text style={{color:Colors.PRIMARY, fontSize:16, fontFamily:'Lato-Regular'}}>{isReadMore?'Read less':'Read more'}</Text>
        </TouchableOpacity>
    </View>
  )
}