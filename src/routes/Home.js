import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

// the ALL_USERS graphql query
const ALL_USERS = gql`
  {
    allUsers {
      id
      email
    }
  }
`;

const Home = ({ data: { allUsers = [] } }) => (
  allUsers.map(u => (<h1 key={u.id}>{u.email}</h1>))
);

// passing the Home component to th graphql higher order function.
export default graphql(ALL_USERS)(Home);
