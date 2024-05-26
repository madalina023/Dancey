import React, { createContext, useContext, useEffect, useState } from "react";
import { sendNotification } from "@/services/NotificationService";
import GlobalAPI from "@/utils/GlobalAPI";
import { client } from "@/utils/KindeConfig";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [checkIns, setCheckIns] = useState([]);
  const nextLevelMapping = {
    Beginner: "Intermediate",
    Intermediate: "Advanced",
  };
  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const user = await client.getUserDetails();
    setUser(user);
  };

  useEffect(() => {
    if (user) {
      fetchAndCheckCheckIns();
    }
  }, [user]);

  const fetchAndCheckCheckIns = async () => {
    try {
      const userEmail = user.email;
      const userCheckIns = await GlobalAPI.getUserCheckIns(userEmail);
      setCheckIns(userCheckIns);
      checkLevelCounts(userCheckIns);
    } catch (error) {
      console.error("Failed to fetch check-ins:", error);
    }
  };

  const checkLevelCounts = async (checkIns) => {
    const levelCounts = checkIns.reduce((acc, item) => {
      const level = item.calendar.level;
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});

    Object.keys(levelCounts).forEach((level) => {
      if (levelCounts[level] > 1 && nextLevelMapping[level]) {
        sendNotification(
          `You are ready to go to the next level - ${nextLevelMapping[level]}.`
        );
      }
    });
  };

  return (
    <NotificationContext.Provider value={{ user, checkIns }}>
      {children}
    </NotificationContext.Provider>
  );
};
