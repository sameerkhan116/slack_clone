import gql from 'graphql-tag';

/* eslint-disable */
export const ALL_TEAMS = gql`
{
  allTeams {
    id
    name
    channels {
      id
      name
    }
  }
  inviteTeams {
    id
    name
    channels {
      id
      name
    }
  }
}
`;
