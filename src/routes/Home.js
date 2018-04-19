import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const ALL_USERS = gql`
  {
    allUsers {
      id
      username
      email
    }
  }
`;

const Home = ({ data: { allUsers = [] } }) => (
  allUsers.map(u => (<h1 key={u.id}>{u.username}</h1>))
);

export default graphql(ALL_USERS)(Home);
