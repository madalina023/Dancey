// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TextInput,
//   FlatList,
//   Image,
//   ActivityIndicator,
//   Button,
// } from "react-native";
// import React, { useEffect, useState, useCallback } from "react";
// import services from "@/utils/services";
// import { FontAwesome5, Feather } from "@expo/vector-icons";

// import { useRouter } from "expo-router";
// import Header from "@/components/Header";
// import Colors from "@/constants/Colors";
// import Categories from "@/components/Categories";
// import Slider from "@/components/Slider";
// import Styles from "@/components/Styles";
// import Trainers from "@/components/Trainers";
// import { client } from "@/utils/KindeConfig";
// import { useUser } from "@clerk/clerk-expo";
// export default function Home() {
//   const { user } = useUser();
//   const ListHeader = useCallback(
//     () => (
//       <>
//         {user && (
//           <View style={styles.headerContainer}>
//             <View style={styles.profileMainContainer}>
//               <View style={styles.profile}>
//                 <Image
//                   source={{ uri: user?.imageUrl }}
//                   style={styles.userImage}
//                 />
//                 <View>
//                   <Text
//                     style={{ color: Colors.BLACK, fontFamily: "Lato-Regular" }}
//                   >
//                     Welcome,
//                   </Text>
//                   <Text
//                     style={{
//                       color: Colors.BLACK,
//                       fontSize: 18,
//                       fontFamily: "Lato-Bold",
//                     }}
//                   >
//                     {user?.firstName}
//                   </Text>
//                 </View>
//               </View>
//               <FontAwesome5 name="bookmark" size={28} color="black" />
//             </View>
//           </View>
//         )}
//         <View style={{ padding: 20 }}>
//           <Slider />
//           <Categories />
//           <Styles />
//           <Trainers />
//         </View>
//       </>
//     ),
//     [user]
//   );

//   return (
//     <FlatList
//       ListHeaderComponent={ListHeader}
//       data={[]}
//       renderItem={({ item }) => <Trainers trainer={item} />}
//       keyExtractor={(item, index) => index.toString()}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   headerContainer: {
//     padding: 30,
//     backgroundColor: Colors.PRIMARY_OPACITY,
//     borderBottomLeftRadius: 40,
//     borderBottomRightRadius: 40,
//   },
//   profileMainContainer: {
//     display: "flex",
//     flexDirection: "row",
//     alignContent: "center",
//     justifyContent: "space-between",
//   },
//   profile: {
//     display: "flex",
//     flexDirection: "row",
//     alignContent: "center",
//     gap: 10,
//   },
//   textInput: {
//     padding: 10,
//     paddingHorizontal: 10,
//     backgroundColor: Colors.WHITE,
//     borderRadius: 8,
//     width: "85%",
//     fontSize: 16,
//     fontFamily: "Lato-Regular",
//   },
//   searchContainer: {
//     marginTop: 15,
//     display: "flex",
//     flexDirection: "row",
//     alignContent: "center",
//     gap: 10,
//     marginBottom: 10,
//     marginLeft: -10,
//   },
//   searchBtn: {
//     backgroundColor: Colors.WHITE,
//     padding: 10,
//     borderRadius: 8,
//     marginLeft: 8,
//   },
//   userImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 70,
//   },
// });
import { View, Text, ScrollView, StyleSheet,TextInput, FlatList,Image,ActivityIndicator,Button } from "react-native";
import React, { useEffect, useState ,useCallback} from "react";
import services from "@/utils/services";import { FontAwesome5, Feather } from "@expo/vector-icons";

import { useRouter } from "expo-router";
import Header from "@/components/Header";
import Colors from "@/constants/Colors";
import Categories from "@/components/Categories";
import Slider from "@/components/Slider";
import Styles from "@/components/Styles";
import Trainers from "@/components/Trainers";
import { client } from "@/utils/KindeConfig";
import { useUser } from "@clerk/clerk-expo";
export default function Home() {
  const router = useRouter();
 
  useEffect(() => {
    checkUserAuth(); 
  }, []);

  /**
   * Used to check user Is already auth or not
   */
  const checkUserAuth = async () => {
    const result = await services.getData("login");
    if (result !== "true") {
      router.replace("/login");
    }
  };

  const handleLogout = async () => {
    const loggedOut = await client.logout();
    if (loggedOut) {
      await services.storeData("login", "false");
      router.replace("/login");
      // User was logged out
    }
  };
   
          
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView}>
        <Slider />
        <Categories />
        <Styles />
        <Trainers />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 10,
  },
});