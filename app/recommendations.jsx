import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import GlobalAPI from "@/utils/GlobalAPI";
import { client } from "@/utils/KindeConfig";
import PageHeading from "@/components/PageHeading";
import Colors from "@/constants/Colors";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const user = await client.getUserDetails();
      console.log("Fetched user data:", user);
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
          console.log("Fetched check-ins:", checkIns);
          const processedRecommendations = processCheckIns(checkIns);
          setRecommendations(processedRecommendations);
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

    // Count check-ins by dance style and level
    checkIns.forEach((checkIn) => {
      const danceStyles = checkIn.calendar.danceStyles;
      const level = checkIn.calendar.level;

      if (danceStyles && level) {
        danceStyles.forEach((styleObj) => {
          const style = styleObj.name; // Accessing the name property of the style object
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

    console.log("Check-in counts:", checkInCounts);

    // Determine recommendations based on check-in counts
    const recommendations = Object.keys(checkInCounts).map((style) => {
      const levels = checkInCounts[style];
      if (levels.beginner >= 2) {
        return `You can advance to the intermediate level in ${style}.`;
      }
      if (levels.intermediate >= 5) {
        return `You can advance to the advanced level in ${style}.`;
      }
      if (levels.advanced >= 5) {
        return `You can try a new style, you have mastered the advanced level in ${style}.`;
      }
      return `Keep going! You are doing great in ${style}.`;
    });

    console.log("Generated recommendations:", recommendations);

    return recommendations;
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
      )}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {marginTop:30,
    flex: 1,
    padding: 16
    },
    recs: {
        marginTop:20
    },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
    recommendationCard: {
    marginTop:5,
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
