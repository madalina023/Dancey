import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function sendNotification(message) {
  console.log("Sending notification with message:", message);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "It is time to advance to the next level!",
      body: message,
    },
    trigger: null, 
  });
}
