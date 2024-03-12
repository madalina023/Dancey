import { View, FlatList, StyleSheet ,TextInput} from 'react-native';
import Header from './Header';
import Slider from './Slider';
import Categories from './Categories';
import Styles from './Styles';
import Trainers from './Trainers';
import React  from 'react';

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

 