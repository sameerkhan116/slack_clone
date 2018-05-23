// Here are a couple of queries that we use multiple times for updating
// cache etc, and hence we store them in a seperate file so that they can
// be re-used.

import gql from 'graphql-tag'; // for creating graphql queries

// the ME query to get the currentUsers id, username, teams, channel etc.
export const ME = gql`
{
  me {
    id
    username
    teams {
      id
      name
      admin
      directMessageMembers {
        id
        username
      }
      channels {
        id
        name
        dm
      }
    }
  }
}
`;

// query for getting team members for a particular team
export const GET_TEAM_MEMBERS = gql`
query($teamId: Int!) {
  getTeamMembers(teamId: $teamId) {
    id
    username
  }
}
`;
