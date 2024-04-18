import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import CalendarPicker from "react-native-calendar-picker";
import Colors from "../../Utils/Colors";
import Heading from "../../Components/Heading";
import GlobalAPI from "../../Utils/GlobalAPI";
import { useUser } from "@clerk/clerk-expo";
import moment from "moment";

export default function TrainersModel({ trainerID, hideModal }) {
  const [timeList, setTimeList] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [note, setNote] = useState("");
  const { user } = useUser();

  useEffect(() => {
    getTime();
  }, []);

  const getTime = () => {
    const newTimeList = [];

    // Start from 10:00 to 19:00 (7 PM in 24-hour format)
    for (let i = 10; i <= 19; i++) {
      newTimeList.push({ time: `${i}:00` });
    }

    setTimeList(newTimeList);
  };

  const createNewBooking = async () => {
    if (!selectedTime || !selectedDate) {
      Alert.alert("Error", "Select date and time.");
      return;
    }

    const formattedDate = moment(selectedDate).format("DD-MMM-YYYY");

    try {
      const existingBookings = await GlobalAPI.getBookingsByDateTime(
        formattedDate,
        selectedTime
      );

      if (existingBookings.bookings && existingBookings.bookings.length > 0) {
        Alert.alert(
          "Error",
          "This time slot is already taken. Please choose another time."
        );
        return;
      }

      const data = {
        userName: user?.fullName,
        userEmail: user?.primaryEmailAddress.emailAddress,
        date: formattedDate,
        time: selectedTime,
        trainerID: trainerID,
        note: note,
      };

      await GlobalAPI.createBooking(data);
      Alert.alert("Success", "Booking created successfully.");
      hideModal();
    } catch (error) {
      console.error(
        "Error creating booking or checking existing bookings:",
        error
      );
      Alert.alert("Error", "There was an error creating the booking.");
    }
  };

  const onDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <ScrollView>
      <KeyboardAvoidingView style={{ padding: 20 }}>
        <TouchableOpacity
          style={{
            marginTop: 30,
            display: "flex",
            flexDirection: "row",
            marginBottom: 40,
            alignItems: "center",
            gap: 10,
          }}
          onPress={() => hideModal()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={{ fontFamily: "Outfit-Bold", fontSize: 22 }}>
            Booking
          </Text>
        </TouchableOpacity>

        <Heading text={"Select date"} />
        <View style={styles.calendarContainer}>
          <CalendarPicker
            onDateChange={setSelectedDate}
            width={350}
            monthTitleStyle={{ fontFamily: "Lato-Bold" }}
            todayTextStyle={{ color: Colors.WHITE }}
            minDate={new Date()}
            todayBackgroundColor={Colors.BLACK}
            selectedDayColor={Colors.PRIMARY}
            selectedDayTextColor={Colors.WHITE}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Heading text={"Select time slot"} />
          <FlatList
            data={timeList}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => setSelectedTime(item.time)}
              >
                <Text
                  style={[
                    selectedTime == item.time
                      ? styles.selectedTime
                      : styles.unselectedTime,
                  ]}
                >
                  {item.time}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={{ paddingTop: 20 }}>
          <Heading text={"Suggestions note"} />
          <TextInput
            placeholder="Note"
            numberOfLines={4}
            multiline={true}
            style={styles.noteTextArea}
            onChange={(text) => setNote(text)}
          />
        </View>
        <TouchableOpacity
          style={{ marginTop: 10 }}
          onPress={() => createNewBooking()}
        >
          <Text style={styles.confirmBtn}> Confirm and book</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  calendarContainer: {
    padding: 30,
    borderRadius: 25,
    marginTop: 15,
    backgroundColor: Colors.PRIMARY_OPACITY2,
  },
  selectedTime: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 10,
    paddingHorizontal: 15,
    color: Colors.WHITE,
    marginTop: 5,
    overflow: "hidden",
    backgroundColor: Colors.PRIMARY,
  },
  unselectedTime: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 10,
    overflow: "hidden",
    paddingHorizontal: 15,
    color: Colors.PRIMARY,
    marginTop: 5,
  },
  noteTextArea: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.PRIMARY,
    textAlignVertical: "top",
    padding: 20,
    fontSize: 14,
    fontFamily: "Lato-Regular",
  },
  confirmBtn: {
    fontFamily: "Lato-Regular",
    fontSize: 18,
    backgroundColor: Colors.PRIMARY,
    color: Colors.WHITE,
    textAlign: "center",
    padding: 10,
    borderRadius: 14,
    elevation: 3,
    overflow: "hidden",
  },
});
