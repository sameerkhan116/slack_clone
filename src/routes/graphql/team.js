import gql from 'graphql-tag';

/* eslint-disable */
export const ME = gql`
{
  me {
    id
    username
    teams {
      id
      name
      admin
      channels {
        id
        name
      }
    }
  }
}
`;
