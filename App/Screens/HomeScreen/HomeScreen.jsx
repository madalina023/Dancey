import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Header from './Header';
import Slider from './Slider';
import Categories from './Categories';
import Styles from './Styles';
import Trainers from './Trainers';

const ListHeader = () => (
  <View>
    <Header/>
    <View style={{padding: 20}}>
      <Slider/>
      <Categories/>
      <Styles/>
      <Trainers/>
    </View>
  </View>
);

export default function HomeScreen() {
  return (
    <FlatList
      ListHeaderComponent={ListHeader}
      data={[]}
      renderItem={({item}) => <Trainers trainer={item}/>}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}


// import { View, Text, StyleSheet, ScrollView } from 'react-native'
// import React from 'react'
// import Header from './Header'
// import Slider from './Slider'
// import Colors from '../../Utils/Colors'
// import Categories from './Categories'
// import Styles from './Styles'
// import Trainers from './Trainers'

// export default function HomeScreen() {
//   return (
//     <View style={{flex:1}}>
//       <ScrollView style={{flex:1 }}>
//         <Header/>
//         <View style={{padding:20}}>
//           <Slider />
//           <Categories/>
//           <Styles/>
//           <Trainers/>
//         </View>
//         </ScrollView>
//     </View>
//   )
// }
