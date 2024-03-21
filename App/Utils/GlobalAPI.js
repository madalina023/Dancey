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
      bookingStatus: Booked, 
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

const getUserBookings = async (userEmail) => {
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
    alert("Booking canceled successfully!");
    // Optionally: Update local state or trigger a refetch of bookings
  } catch (error) {
    console.error("Error canceling booking", error);
    alert("Failed to cancel booking.");
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
          statusSubscription: "${subscriptionData.statusSubscription}" 
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

const getActiveSubscription = async () => {
  const query = gql`
    query ActiveSubscriptions {
      activeSubscriptions {
        date
        time
        statusSubscription
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
  const result = await request(MASTER_URL, query);
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

export default {
  getSlider,
  getCategories,
  getDanceStyle,
  getTrainers,
  getTrainersListByStyle,
  createBooking,
  getUserBookings,
  cancelBooking,
  getSubscription,
  createActiveSubscription,
  getActiveSubscription,
  updateExpiredSubscriptionsStatus,
  updateSubscriptionStatus,
  checkAndUpdateSubscriptionStatuses,
  getCalendarEventsWithDetails
};
