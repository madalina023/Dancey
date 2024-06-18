import { request, gql } from "graphql-request";

const MASTER_URL =
  "https://api-eu-west-2.hygraph.com/v2/cltacnqry2dsn07uzspnwonu5/master";
const getSlider = async () => {
  const query = gql`
    query GetSlider {
      sliders {
        id
        name
        image {
          url
        }
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

const getCategories = async () => {
  const query = gql`
    query GetCategory {
      categories {
        id
        name
        icon {
          url
        }
      }
    }
  `;
   try {
    const result = await request(MASTER_URL, query);
    console.log("Fetched Categories:", result);
    return result;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};
 
const getDanceStyle = async () => {
  const query = gql`
    query getDanceStyle {
      danceStyles {
        id
        name
        icon {
          url
        }
        description
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};
const getTrainers = async () => {
  const query = gql`
    query getTrainer {
      trainers {
        id
        name
        contact
        danceStyles {
          name
        }
        about
        images {
          url
        }
        experience
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

const getTrainersListByStyle = async (danceStyle) => {
  const query = gql`
    query getTrainerByStyle($danceStyle: String!) {
      trainers(where: { danceStyles_some: { name: $danceStyle } }) {
        id
        name
        contact
        danceStyles {
          name
        }
        about
        images {
          url
        }
        experience
      }
    }
  `;
  const variables = { danceStyle };
  const result = await request(MASTER_URL, query, variables);
  return result;
};const createBooking = async (data) => {
  const mutationQuery = gql`
    mutation createBooking(
      $trainerID: ID!
      $date: String!
      $time: String!
      $userEmail: String!
      $userName: String!
    ) {
      createBooking(
        data: {
          bookingStatus: "Booked"
          trainer: { connect: { id: $trainerID } }
          date: $date
          time: $time
          userEmail: $userEmail
          userName: $userName
        }
      ) {
        id
      }
      publishManyBookings(to: PUBLISHED) {
        count
      }
    }
  `;
  const variables = {
    trainerID: data.trainerID,
    date: data.date,
    time: data.time,
    userEmail: data.userEmail,
    userName: data.userName,
  };
  const result = await request(MASTER_URL, mutationQuery, variables);
  return result;
};

const getUserBookings = async (userEmail) => {
  const query = gql`
    query GetUserBookings($userEmail: String!) {
      bookings(orderBy: updatedAt_DESC, where: { userEmail: $userEmail }) {
        time
        userEmail
        userName
        bookingStatus
        date
        id
        trainer {
          about
          contact
          id
          danceStyles {
            name
          }
          images {
            url
          }
          name
          experience
        }
      }
    }
  `;
  const variables = { userEmail };
  const result = await request(MASTER_URL, query, variables);
  return result;
};

 const getBookingsByDateTime = async (date, time) => {
  const query = gql`
    query GetBookingsByDateTime($date: String!, $time: String!) {
      bookings(where: { date: $date, time: $time }) {
        id
        date
        time
        userEmail
        userName
      }
    }
  `;
  const variables = { date, time };
  const result = await request(MASTER_URL, query, variables);
  return result;
};

export const updateBookingStatus = async (bookingId, status) => {
  console.log(
    `Attempting to update booking status for booking ID ${bookingId} to ${status}`
  );
  const mutation = gql`
    mutation UpdateBookingStatus($id: ID!, $status: String!) {
      updateBooking(where: { id: $id }, data: { bookingStatus: $status }) {
        id
        bookingStatus
      }
    }
  `;

  const variables = { id: bookingId, status };

  try {
    const result = await request(MASTER_URL, mutation, variables);
    console.log("Booking status updated:", result);
    return result;
  } catch (error) {
    console.error("Failed to update booking status:", error);
    throw new Error("Failed to update booking status.");
  }
};const cancelBooking = async (bookingId) => {
  const DELETE_BOOKING = gql`
    mutation DeleteBooking($id: ID!) {
      deleteBooking(where: { id: $id }) {
        id
      }
    }
  `;

  try {
    const variables = { id: bookingId };
    await request(MASTER_URL, DELETE_BOOKING, variables);
  } catch (error) {
    console.log("Error canceling booking:", error);

    // Extracting detailed error message if available
    const errorMessage =
      error.response?.errors?.[0]?.message || "Unknown error";
  }
};

const getSubscription = async (userEmail) => {
  const query = gql`
    query getSubscription($userEmail: String!) {
      subscriptions(where: { userEmail: $userEmail }) {
        id
        image {
          url
        }
        name
        price
      }
    }
  `;
  const variables = { userEmail };
  const result = await request(MASTER_URL, query, variables);
  return result;
};

const createActiveSubscription = async (subscriptionData) => {
  const mutation = gql`
    mutation createActiveSubscription(
      $subscriptionID: ID!
      $date: String!
      $time: String!
      $statusSubscription: String!
      $userName: String!
      $userEmail: String!
    ) {
      createActiveSubscription(
        data: {
          subscriptions: { connect: { id: $subscriptionID } }
          date: $date
          time: $time
          statusSubscription: $statusSubscription
          userName: $userName
          userEmail: $userEmail
        }
      ) {
        id
      }
      publishManyActiveSubscriptions(to: PUBLISHED) {
        count
      }
    }
  `;
  const variables = {
    subscriptionID: subscriptionData.subscriptionID,
    date: subscriptionData.date,
    time: subscriptionData.time,
    statusSubscription: subscriptionData.statusSubscription,
    userName: subscriptionData.userName,
    userEmail: subscriptionData.userEmail,
  };
  const result = await request(MASTER_URL, mutation, variables);
  return result;
};


const getActiveSubscription = async (userEmail) => {
  const query = gql`
    query ActiveSubscriptions($userEmail: String!) {
      activeSubscriptions(where: { userEmail: $userEmail }) {
        date
        time
        statusSubscription
        userName
        userEmail
        subscriptions {
          id
          name
          image {
            url
          }
          price
        }
      }
    }
  `;
  const variables = { userEmail }; // Ensure this matches your server's expectations
  const result = await request(MASTER_URL, query, variables); // Passing variables correctly
  return result;
};

const updateExpiredSubscriptionsStatus = async () => {
  const query = gql`
    query ActiveSubscriptions {
      activeSubscriptions {
        id
        date
        statusSubscription
      }
    }
  `;

  try {
    const result = await request(MASTER_URL, query);
    return result.activeSubscriptions;
  } catch (error) {
    console.error("Error fetching active subscriptions", error);
    throw new Error("Failed to fetch active subscriptions.");
  }
};
const UPDATE_SUBSCRIPTION_STATUS = gql`
  mutation UpdateSubscriptionStatus($id: ID!, $status: String!) {
    updateActiveSubscription(
      where: { id: $id }
      data: { statusSubscription: $status }
    ) {
      id
      statusSubscription
    }
  }
`;

const updateSubscriptionStatus = async (id, status) => {
  const variables = { id, status };
  try {
    const result = await request(
      MASTER_URL,
      UPDATE_SUBSCRIPTION_STATUS,
      variables
    );
    console.log(`Subscription status updated:`, result);
  } catch (error) {
    console.error(`Error updating subscription status:`, error);
  }
};
const checkAndUpdateSubscriptionStatuses = async () => {
  const activeSubscriptions = await updateExpiredSubscriptionsStatus();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  await Promise.all(
    activeSubscriptions.map(async (subscription) => {
      const subscriptionDate = new Date(subscription.date);
      if (subscriptionDate < oneMonthAgo) {
        await updateSubscriptionStatus(subscription.id, "Expired");
      }
    })
  );
};
const getCalendarEventsWithDetails = async () => {
  const query = gql`
    query GetCalendarEventsWithDetails {
      calendars {
        id
        dayOfWeek
        startTime
        endTime
        level
        danceStyles {
          id
          name
          trainers {
            id
            name
            levelOnTraining
          }
        }
      }
    }
  `;

  try {
    const result = await request(MASTER_URL, query);
    return result.calendars;
  } catch (error) {
    console.error("Error fetching calendar events with details", error);
    throw new Error("Failed to fetch calendar events with details.");
  }
};

async function checkInForClass(userName, userEmail, calendarId) {
  const mutation = gql`
    mutation CheckInForClass(
      $userName: String!
      $userEmail: String!
      $calendarId: ID!
      $date: Date!
    ) {
      createCheckInForClass(
        data: {
          userName: $userName
          userEmail: $userEmail
          calendar: { connect: { id: $calendarId } }
          date: $date
        }
      ) {
        id
        userName
        userEmail
        calendar {
          id
          level
          danceStyles {
            name
          }
        }
        date
      }
      publishManyCheckInForClasses(to: PUBLISHED) {
        count
      }
    }
  `;

  // Get the current date and time in ISO 8601 format
  const currentDate = new Date().toISOString();

  // Define the variables for the mutation including the current date
  const variables = {
    userName,
    userEmail,
    calendarId,
    date: currentDate, // Assuming your backend is expecting an ISO 8601 string for the date
  };

  try {
    const result = await request(MASTER_URL, mutation, variables);
    return result.createCheckInForClass;
  } catch (error) {
    console.error("Error performing check-in", error);
    throw new Error("Failed to perform check-in.");
  }
}
const checkUserCheckInQuery = gql`
  query checkInForClasses($calendarId: ID!, $date: Date!, $userEmail: String!) {
    checkInForClasses(
      where: {
        AND: [
          { calendar: { id: $calendarId } }
          { date: $date }
          { userEmail: $userEmail }
        ]
      }
    ) {
      id
      userName
      userEmail
      date
      calendar {
        id
        danceStyles {
          id
          name
        }
        dayOfWeek
        startTime
        endTime
        level
      }
    }
  }
`;
// Function to check user check-ins
const checkUserCheckIn = async (calendarId, date, userEmail) => {
  const variables = {
    calendarId,
    date,
    userEmail,
  };

  try {
    const response = await request(
      MASTER_URL,
      checkUserCheckInQuery,
      variables
    );
    console.log("Check-in query successful", response);

    // Safely check if there are any check-ins
    return (
      Array.isArray(response.checkInForClasses) &&
      response.checkInForClasses.length > 0
    );
  } catch (error) {
    console.error("Error performing check-in query", error);
    throw new Error("Failed to perform check-in query.");
  }
};

const getUserCheckIns = async (userEmail) => {
  const query = gql`
    query GetUserCheckIns($userEmail: String!) {
      checkInForClasses(where: { userEmail: $userEmail }) {
        id
        userName
        userEmail
        date
        calendar {
          id
          danceStyles {
            name
          }
          dayOfWeek
          startTime
          endTime
          level
        }
      }
    }
  `;

  const variables = {
    userEmail,
  };

  try {
    const response = await request(MASTER_URL, query, variables);
    console.log("User check-ins fetched successfully", response);
    return response.checkInForClasses; // Assuming this is the correct path in the response
  } catch (error) {
    console.error("Error fetching user check-ins", error);
    throw new Error("Failed to fetch user check-ins.");
  }
};

export default {
  getSlider,
  getCategories,
  getDanceStyle,
  getTrainers,
  getTrainersListByStyle,
  createBooking,
  getUserBookings,
  updateBookingStatus,
  cancelBooking,
  getSubscription,
  createActiveSubscription,
  getActiveSubscription,
  updateExpiredSubscriptionsStatus,
  updateSubscriptionStatus,
  checkAndUpdateSubscriptionStatuses,
  getCalendarEventsWithDetails,
  checkInForClass,
  getBookingsByDateTime,
  checkUserCheckIn,
  getUserCheckIns,
};
