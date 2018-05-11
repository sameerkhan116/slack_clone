import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Comment } from 'semantic-ui-react';

import Messages from '../components/Messages';

const NEW_DIRECT_MESSAGE_SUB = gql`
  subscription($teamId: Int!, $userId: Int!) {
    newDirectMessage(teamId: $teamId, userId: $userId) {
      id
      text
      sender {
        username
      }
      created_at
    }
  }
`;

class DirectMessageContainer extends Component {
  componentWillMount() {
    const { teamId, receiverId } = this.props;
    this.unsubscribe = this.subscribe(teamId, receiverId);
  }

  componentWillReceiveProps({ teamId, receiverId }) {
    if (this.props.teamId !== teamId || this.props.receiverId !== receiverId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribe(teamId, receiverId);
    }
  }


  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  subscribe = (teamId, userId) =>
    this.props.data.subscribeToMore({
      document: NEW_DIRECT_MESSAGE_SUB,
      variables: {
        teamId,
        userId,
      },
      updateQuery: (prev, { subscriptionData: { data } }) => {
        if (!data) {
          return prev;
        }

        return {
          ...prev,
          directMessages: [...prev.directMessages, data.newDirectMessage],
        };
      },
    })

  render() {
    const { data: { loading, directMessages } } = this.props;
    return loading ? null : (
      <Messages>
        <Comment.Group>
          {directMessages.map(m => (
            <Comment key={`${m.id}`}>
              <Comment.Content>
                <Comment.Author as="a">{m.sender.username}</Comment.Author>
                <Comment.Metadata>
                  <div>{m.created_at}</div>
                </Comment.Metadata>
                <Comment.Text>{m.text}</Comment.Text>
                <Comment.Actions>
                  <Comment.Action>Reply</Comment.Action>
                </Comment.Actions>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </Messages>
    );
  }
}

const DIRECT_MESSAGES = gql`
  query($teamId: Int!, $receiverId: Int!) {
    directMessages(teamId: $teamId, receiverId: $receiverId) {
      id
      text
      sender {
        username
      }
      created_at
    }
  }
`;

export default graphql(DIRECT_MESSAGES, {
  options: ({ teamId, receiverId }) => ({
    fetchPolicy: 'network-only',
    variables: {
      teamId,
      receiverId,
    },
  }),
})(DirectMessageContainer);
