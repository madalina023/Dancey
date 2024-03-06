import { request, gql } from 'graphql-request'
const MASTER_URL = "https://api-eu-west-2.hygraph.com/v2/cltacnqry2dsn07uzspnwonu5/master"
const getSlider=async() =>{
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
  
`
const result = await request(MASTER_URL, query)
return result
}

const getCategories=async() =>{
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
      ` 
      const result = await request(MASTER_URL, query);
      return result;
}
const getDanceStyle=async() =>{
    const query = gql`
    query getDanceStyle {
        danceStyles {
          id
          name
          icon {
            url
          }
        }
      }
      
      ` 
      const result = await request(MASTER_URL, query);
      return result;
}
const getTrainers=async() =>{
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
  ` 
  const result = await request(MASTER_URL, query);
  return result;
}

const getTrainersListByStyle=async(danceStyle) =>{
  const query = gql`
  query getTrainerByStyle {
    trainers(where: {danceStyles_some: {name: "`+danceStyle+`"}}) {
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
  ` 
  const result = await request(MASTER_URL, query);
  return result;
}
const createBooking=async(data ) =>{
  const mutationQuery = gql`
  mutation createBooking {
  createBooking(
    data: {
      bookingStatus: Booked, 
      trainer: 
        {connect: {id: "`+data.trainerID+`"}}, 
        date: "`+data.date+`", 
        time: "`+data.time+`", 
        userEmail: "`+data.userEmail+`", 
        userName: "`+data.userName+`"}
  ) {
    id
  }
  publishManyBookings(to:PUBLISHED)
  {count}
}
`  
const result = await request(MASTER_URL, mutationQuery);
return result;}

export default{
    getSlider,
    getCategories,
    getDanceStyle, 
    getTrainers,
    getTrainersListByStyle,
    createBooking
}