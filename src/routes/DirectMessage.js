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
  data: { loading, getUser, me },
  match: { params: { teamId, receiverId } },
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
      <Header channelName={getUser.username} />
      <DirectMessageContainer teamId={team.id} receiverId={receiverId} />
      <SendMessage
        placeholder={receiverId}
        onSubmit={async (text) => {
          const response = await mutate({
            variables: {
              receiverId,
              text,
              teamId,
            },
            optimisticResponse: {
              createDirectMessage: true,
            },
            update: (proxy) => {
              const data = proxy.readQuery({ query: ME });
              const teamIndex = findIndex(data.me.teams, ['id', team.id]);
              const notAlreadyThere = data.me.teams[teamIndex].directMessageMembers
                .every(member => member.id !== parseInt(receiverId, 10));
              if (notAlreadyThere) {
              data.me.teams[teamIndex].directMessageMembers.push({
                __typename: 'User',
                id: receiverId,
                username: getUser.username,
              });
              }
              proxy.writeQuery({ query: ME, data });
            },
          });
          console.log(response);
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

const DIRECT_MESSAGE_ME = gql`
  query($userId: Int!) {
    getUser(userId: $userId) {
      username
    }
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

export default compose(
  graphql(CREATE_DIRECT_MESSAGE),
  graphql(DIRECT_MESSAGE_ME, {
    options: ({ match: { params: { receiverId } } }) => ({
      variables: {
        userId: receiverId,
      },
      fetchPolicy: 'network-only',
    }),
  }),
)(DirectMessage);

