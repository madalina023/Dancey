import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Agenda } from "react-native-calendars";
import { Card, Avatar } from "react-native-paper";
import GlobalAPI from "../../Utils/GlobalAPI";
import Colors from "../../Utils/Colors";

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split("T")[0];
};

const CalendarScreen = () => {
  const [items, setItems] = useState({});
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventResult = await GlobalAPI.getCalendarEventsWithDetails();
        const newItems = {};

        const addEventsOnDayOfWeek = (dayOfWeek, events) => {
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();
          currentDate.setDate(1); // Start at the first of the month

          while (currentDate.getMonth() === currentMonth) {
            const dayName = currentDate.toLocaleDateString("en-US", {
              weekday: "long",
            });
            if (dayName.toLowerCase() === dayOfWeek.toLowerCase()) {
              const dateString = timeToString(currentDate);
              newItems[dateString] = newItems[dateString] || [];

              events.forEach((event) => {
                event.danceStyles.forEach((danceStyle) => {
                  const matchingTrainers = danceStyle.trainers.filter(
                    (trainer) =>
                      trainer.levelOnTraining &&
                      trainer.levelOnTraining.toLowerCase() ===
                        event.level.toLowerCase()
                  );

                  const trainerNames =
                    matchingTrainers.length > 0
                      ? `with ${matchingTrainers
                          .map((trainer) => trainer.name)
                          .join(", ")}`
                      : "";

                  // Including event.level in the name property
                  newItems[dateString].push({
                    name: `${danceStyle.name} class ${trainerNames} (${event.level})`, // Level name added here
                    height: 100, // Or your logic for height
                    startTime: event.startTime,
                    endTime: event.endTime,
                    level: event.level,
                  });
                });
              });
            }
            currentDate.setDate(currentDate.getDate() + 1);
          }
        };

        // Loop through all events and add them based on their dayOfWeek and level
        eventResult.forEach((event) => {
          addEventsOnDayOfWeek(event.dayOfWeek, [event]);
        });

        setItems(newItems);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const renderEmptyData = () => {
    return (
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Text style={{ fontSize: 18, color: "#666" }}>
          There are no classes today.
        </Text>
      </View>
    );
  };
  const renderItem = (item) => {
    return (
      <TouchableOpacity style={{ marginRight: 10, marginTop: 17 }}>
        <Card>
          <Card.Content>
            <View
              style={{
                flexDirection: "column", // Change to column for vertical layout
                justifyContent: "space-between",
              }}
            >
              {/* Event name and level */}
              <Text style={{ fontSize: 16, marginBottom: 4 }}>{item.name}</Text>

              {/* Event time on a new row */}
              <Text
                style={{ fontSize: 14, color: "#666" }}
              >{`Time: ${item.startTime} - ${item.endTime}`}</Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Agenda
        items={items}
        loadItemsForMonth={(day) => {}}
        selected={timeToString(new Date())}
        renderItem={renderItem}
        renderEmptyData={renderEmptyData}
        theme={{
          todayBackgroundColor: Colors.PRIMARY,
          agendaTodayColor: Colors.PRIMARY,
          dotColor: Colors.PRIMARY,
          selectedDayBackgroundColor: Colors.PRIMARY,
        }}
      />
    </View>
  );
};

export default CalendarScreen;
