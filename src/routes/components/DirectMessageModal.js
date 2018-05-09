import React from 'react';
import { Form, Modal, Input, Button } from 'semantic-ui-react';
import Downshift from 'downshift';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

const inlineStyle = {
  modal: {
    marginTop: '0px !important',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
};

const DirectMessageModal = ({
  open,
  onClose,
  teamId,
  data: {
    loading,
    getTeamMembers,
  },
  history,
}) => (
  <Modal style={inlineStyle.modal} onClose={onClose} open={open} size="small">
    <Modal.Header>Direct Message</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          {!loading && (
            <Downshift
              onChange={(selectedUser) => {
              history.push(`/view-team/dm/${teamId}/${selectedUser.id}`);
              onClose();
              }}
            >
              {({
              getInputProps,
              getItemProps,
              isOpen,
              inputValue,
              selectedItem,
              highlightedIndex,
            }) => (
              <div>
                <Input {...getInputProps({ placeholder: 'User?' })} fluid type="text" />
                {isOpen ? (
                  <div style={{ border: '1px solid #ccc' }}>
                    {getTeamMembers
                      .filter(i => !inputValue || i.username.toLowerCase().includes(inputValue.toLowerCase()))
                      .map((item, index) => (
                        <div
                          {...getItemProps({ item })}
                          key={item.id}
                          style={{
                            backgroundColor:
                              highlightedIndex === index ? 'gray' : 'white',
                            fontWeight: selectedItem === item ? 'bold' : 'normal',
                          }}
                        >
                          {item.username}
                        </div>
                      ))
                    }
                  </div>
                ) : null}
              </div>
            )}
            </Downshift>
          )}
        </Form.Field>
        <Form.Group>
          <Button onClick={onClose} fluid>Cancel</Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

const GET_TEAM_MEMBERS = gql`
  query($teamId: Int!) {
    getTeamMembers(teamId: $teamId) {
      id
      username
    }
  }
`;

export default withRouter(graphql(GET_TEAM_MEMBERS, {
  variables: ({ teamId }) => ({
    teamId,
  }),
})(DirectMessageModal));
