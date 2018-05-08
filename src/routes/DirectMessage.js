import React from 'react';
import { compose, graphql } from 'react-apollo';
import { findIndex } from 'lodash';
import { Redirect } from 'react-router-dom';
import gql from 'graphql-tag';

import AppLayout from './components/AppLayout';
import Header from './components/Header';
import SendMessage from './components/SendMessage';
import Sidebar from './containers/Sidebar';
import DirectMessageContainer from './containers/DirectMessageContainer';

import { ME } from './graphql/team';

const DirectMessage = ({
  mutate,
  data: {
    loading, me,
  }, match: {
    params: {
      teamId, receiverId,
    },
  },
}) => {
  if (loading) {
    return null;
  }

  const { username, teams } = me;

  if (!teams.length) {
    return <Redirect to="/create-team" />;
  }

  const teamIdInteger = parseInt(teamId, 10);
  const teamIdx = teamIdInteger ? findIndex(teams, ['id', teamIdInteger]) : 0;
  const team = teamIdx === -1 ? teams[0] : teams[teamIdx];

  return (
    <AppLayout>
      <Sidebar
        teams={teams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))}
        team={team}
        username={username}
      />
      <Header channelName="Someone's username" />
      <DirectMessageContainer teamId={teamId} receiverId={receiverId} />
      <SendMessage
        placeholder={receiverId}
        onSubmit={async (text) => {
          await mutate({
            variables: {
              receiverId,
              text,
              teamId,
            },
          });
        }}
      />
    </AppLayout>
  );
};

const CREATE_DIRECT_MESSAGE = gql`
  mutation($receiverId: Int!, $text: String!, $teamId: Int!) {
    createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
  }
`;

export default compose(
  graphql(CREATE_DIRECT_MESSAGE),
  graphql(ME, {
    options: {
      fetchPolicy: 'network-only',
    },
  }),
)(DirectMessage);

