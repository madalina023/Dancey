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
        data: { subscriptions: { connect: { id: "${subscriptionData.subscriptionID}" } }, 
        date: "${subscriptionData.date}", time: "${subscriptionData.time}" }
      ) {
        id
      }
      publishManyActiveSubscriptions(to:PUBLISHED){count}
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
 getActiveSubscription
};
