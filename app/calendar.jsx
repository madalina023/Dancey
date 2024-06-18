import React, { useState, useEffect, useCallback, memo } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Agenda } from "react-native-calendars";
import { Card } from "react-native-paper";
import GlobalAPI from "@/utils/GlobalAPI";
import Colors from "@/constants/Colors";

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split("T")[0];
};

const CalendarScreen = () => {
  const [items, setItems] = useState({});
  const [selectedDate, setSelectedDate] = useState(timeToString(new Date()));

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
            const dayName = currentDate
              .toLocaleDateString("en-US", {
                weekday: "long",
              })
              .toLowerCase();

            // Debugging statement for current dayName
            console.log(
              `Checking date: ${currentDate}, dayName: ${dayName}, target dayOfWeek: ${dayOfWeek}`
            );

            if (dayName === dayOfWeek.toLowerCase()) {
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

                  // Debugging statement for trainers
                  console.log(
                    `Event: ${event.level}, Trainers: ${trainerNames}`
                  );

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
          console.log(`Adding event: ${event.dayOfWeek}`);
          addEventsOnDayOfWeek(event.dayOfWeek, [event]);
        });

        console.log("New items: ", newItems); // Debugging statement to check items
        setItems(newItems);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    console.log("Items:", items); // Debugging statement to check items
  }, [items]);

  const renderEmptyData = useCallback(() => {
    return (
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Text style={{ fontSize: 18, color: "#666" }}>
          There are no classes today.
        </Text>
      </View>
    );
  }, []);

  const RenderItem = memo(({ item }) => {
    if (!item) {
      return null; // Add this check to ensure item is not undefined
    }

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
  });

  const filterItemsForSelectedDate = () => {
    return { [selectedDate]: items[selectedDate] || [] };
  };

  return (
    <View style={{ flex: 1, marginTop: 40 }}>
      <Agenda
        items={filterItemsForSelectedDate()}
        selected={selectedDate}
        renderItem={(item) => <RenderItem item={item} />}
        renderEmptyData={renderEmptyData}
        onDayPress={(day) => {
          setSelectedDate(timeToString(day.timestamp));
        }}
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
