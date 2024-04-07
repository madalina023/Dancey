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
  const result = await request(MASTER_URL, query);
  return result;
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
  const query =
    gql`
  query getTrainerByStyle {
    trainers(where: {danceStyles_some: {name: "` +
    danceStyle +
    `"}}) {
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
const createBooking = async (data) => {
  const mutationQuery =
    gql`
  mutation createBooking {
  createBooking(
    data: {
      bookingStatus: "Booked", 
      trainer: 
        {connect: {id: "` +
    data.trainerID +
    `"}}, 
        date: "` +
    data.date +
    `", 
        time: "` +
    data.time +
    `", 
        userEmail: "` +
    data.userEmail +
    `", 
        userName: "` +
    data.userName +
    `"}
  ) {
    id
  }
  publishManyBookings(to:PUBLISHED)
  {count}
}
`;
  const result = await request(MASTER_URL, mutationQuery);
  return result;
};

const getUserBookings = async (userEmail, trainerID) => {
  const query =
    gql`
    query GetUserBookings {
      bookings(orderBy: updatedAt_DESC, where: {userEmail: "` +
    userEmail +
    `"}) {
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
  const result = await request(MASTER_URL, query);

  return result;
};
// This is a conceptual example. Adjust it according to your actual API's capabilities
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
};
const cancelBooking = async (bookingId) => {
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
    query getSubscription {
      subscriptions {
        id
        image {
          url
        }
        name
        price
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

const createActiveSubscription = async (subscriptionData) => {
  const mutation = gql`
    mutation createActiveSubscription {
      createActiveSubscription(
        data: { 
          subscriptions: { connect: { id: "${subscriptionData.subscriptionID}" } }, 
          date: "${subscriptionData.date}", 
          time: "${subscriptionData.time}",
          statusSubscription: "${subscriptionData.statusSubscription}" ,
          userName:"${subscriptionData.userName}",
          userEmail:"${subscriptionData.userEmail}"
        }
      ) {
        id
      }
      publishManyActiveSubscriptions(to: PUBLISHED) {
        count
      }
    }
  `;
  // Execute the mutation using your GraphQL client
  const result = await request(MASTER_URL, mutation);
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

const createUserMutation = gql`
  mutation createUserAuth(
    $name: String!
    $email: String!
    $mobileNumber: String!
    $password: String!
  ) {
    createUserAuth(
      data: {
        name: $name
        email: $email
        mobileNumber: $mobileNumber
        password: $password
      }
    ) {
      id
    }
  }
`;

export const createUser = async (variables) => {
  try {
    const response = await request(MASTER_URL, createUserMutation, variables);
    if (response.errors) {
      console.error("GraphQL Error:", response.errors);
      throw new Error("Error creating user in Hygraph.");
    }
    return response.data;
  } catch (error) {
    console.error("Request Failed:", error);
    throw error; // Rethrow or handle as needed
  }
};
const getUsersAuth = async (email, plainTextPassword) => {
  const query = gql`
    query MyQuery($email: String!) {
      userAuths(where: { email: $email }) {
        id
        email
        name
        password
        image {
          url
        }
        mobileNumber
      }
    }
  `;

  const variables = { email };
  console.log(`Attempting to fetch user with email: '${email}'`);

  try {
    const result = await request(MASTER_URL, query, variables);
    console.log("GraphQL Response:", result); // Log the raw response

    if (result.userAuths.length > 0) {
      // Proceed with authentication...
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};
const saveOAuthUser = async (name, email, photoURL) => {
  const mutation = gql`
    mutation userAuths($name: String!, $email: String!, $photoURL: String!) {
      userAuths(data: { name: $name, email: $email, photoURL: $photoURL }) {
        id
      }
    }
  `;

  try {
    const response = await request(MASTER_URL, mutation, {
      name,
      email,
      photoURL,
    });
    console.log("User saved:", response);
    return response;
  } catch (error) {
    console.error("Error saving OAuth user:", error);
    throw error;
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
  createUser,
  saveOAuthUser,
  getUsersAuth,getBookingsByDateTime
};
