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
      directMessageMembers {
        id
        username
      }
      channels {
        id
        name
      }
    }
  }
}
`;

export const GET_TEAM_MEMBERS = gql`
query($teamId: Int!) {
  getTeamMembers(teamId: $teamId) {
    id
    username
  }
}
`;
