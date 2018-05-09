import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Comment } from 'semantic-ui-react';

import Messages from '../components/Messages';

// const NEW_DIRECT_MESSAGE_SUB = gql`

// `;

// eslint-disable-next-line react/prefer-stateless-function
class DirectMessageContainer extends Component {
  // componentWillMount() {

  // }

  // componentWillUnmount() {

  // }
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
  variables: ({ teamId, receiverId }) => ({
    teamId,
    receiverId,
  }),
  options: {
    fetchPolicy: 'network-only',
  },
})(DirectMessageContainer);
