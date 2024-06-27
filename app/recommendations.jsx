import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import GlobalAPI from "@/utils/GlobalAPI";
import { client } from "@/utils/KindeConfig";
import PageHeading from "@/components/PageHeading";
import Colors from "@/constants/Colors";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [user, setUser] = useState(null);
  const [userStyles, setUserStyles] = useState(new Set());

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const user = await client.getUserDetails();
      setUser(user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const fetchCheckIns = async () => {
      try {
        if (user) {
          const checkIns = await GlobalAPI.getUserCheckIns(user.email);
          const { recommendations, stylesSet } = processCheckIns(checkIns);
          setUserStyles(stylesSet);
          setRecommendations(recommendations);
        }
      } catch (error) {
        console.error("Error fetching check-ins:", error);
      }
    };

    if (user) {
      fetchCheckIns();
    }
  }, [user]);

  const processCheckIns = (checkIns) => {
    const checkInCounts = {};
    const stylesSet = new Set();

    checkIns.forEach((checkIn) => {
      const danceStyles = checkIn.calendar.danceStyles;
      const level = checkIn.calendar.level;

      if (danceStyles && level) {
        danceStyles.forEach((styleObj) => {
          const style = styleObj.name;
          stylesSet.add(style);  
          if (!checkInCounts[style]) {
            checkInCounts[style] = {
              beginner: 0,
              intermediate: 0,
              advanced: 0,
            };
          }
          checkInCounts[style][level.toLowerCase()]++;
        });
      }
    });

    const recommendations = [];
    Object.keys(checkInCounts).forEach((style) => {
      const levels = checkInCounts[style];
      if (levels.beginner >= 5) {
        recommendations.push(
          `You can advance to the intermediate level in ${style}.`
        );
      } else if (levels.intermediate >= 5) {
        recommendations.push(
          `You can advance to the advanced level in ${style}.`
        );
      } else if (levels.advanced >= 5) {
        recommendations.push(getAdvancedRecommendations(style, stylesSet));
      } else {
        recommendations.push(`Keep going! You are doing great in ${style}.`);
      }
    });

    return { recommendations, stylesSet };
  };

  const getAdvancedRecommendations = (currentStyle, stylesSet) => {
    const recommendationsMap = {
      Bachata: ["Salsa", "Kizomba"],
      Salsa: ["Cha-cha", "Kizomba"],
      Kizomba: ["Waltz", "Tango", "Zouk", "Bachata"],
      Waltz: ["Tango"],
      Tango: ["Kizomba, Waltz"],
      Zouk: ["Waltz"],
    };

    const recommendedStyles = recommendationsMap[currentStyle] || [];

    const filteredStyles = recommendedStyles.filter(
      (style) => !stylesSet.has(style)
    );

    if (filteredStyles.length > 0) {
      const stylesToTry = filteredStyles.join(", ");
      return `You have mastered the advanced level in ${currentStyle}. You can try ${stylesToTry}.`;
    } else {
      return `You have mastered the advanced level in ${currentStyle}. Continue with the styles you are currently practicing!`;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <PageHeading title="Recommendations" />
      <View style={styles.recs}>
        {recommendations.length > 0 ? (
          recommendations.map((rec, index) => (
            <View key={index} style={styles.recommendationCard}>
              <Text style={styles.recommendationText}>{rec}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noRecommendations}>
            No recommendations available
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    padding: 16,
  },
  recs: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  recommendationCard: {
    marginTop: 5,
    backgroundColor: Colors.PRIMARY_OPACITY2,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  recommendationText: {
    fontSize: 18,
  },
  noRecommendations: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Recommendations;
