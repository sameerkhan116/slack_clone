import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import _ from 'lodash';
import decode from 'jwt-decode';

import Channels from '../components/Channels';
import Teams from '../components/Teams';

const Sidebar = ({ data: { loading, allTeams }, currentTeamId }) => {
  if (loading) return null;

  const teamIdx = _.findIndex(allTeams, ['id', currentTeamId]);
  const team = allTeams[teamIdx];
  let username = '';
  try {
    const token = localStorage.getItem('token');
    const { user } = decode(token);
    // eslint-disable-next-line
    username = user.username;
  } catch (e) {
    return null;
  }

  return [
    <Teams
      key="team-sidebar"
      teams={allTeams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))}
    />,
    <Channels
      key="channel-sidebar"
      teamname={team.name}
      username={username}
      channels={team.channels}
      users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }]}
    />,
  ];
};

const ALL_TEAMS = gql`
  {
    allTeams {
      id
      name
      channels {
        id
        name
      }
    }
  }
`;

export default graphql(ALL_TEAMS)(Sidebar);
