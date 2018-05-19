import React from 'react';
import { Form, Modal, Button } from 'semantic-ui-react';
import { graphql, compose } from 'react-apollo';
import { withFormik } from 'formik';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';

import MultiSelectUsers from './MultiSelectUsers';

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
  values,
  setFieldValue,
  currentUserId,
  handleSubmit,
  isSubmitting,
  resetForm,
}) => (
  <Modal style={inlineStyle.modal} onClose={onClose} open={open} size="small">
    <Modal.Header>Direct Message</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <MultiSelectUsers
            value={values.members}
            handleChange={(e, { value }) => setFieldValue('members', value)}
            teamId={teamId}
            placeholder="Select members to DM"
            currentUserId={currentUserId}
          />
        </Form.Field>
        <Form.Group>
          <Button disabled={isSubmitting} onClick={handleSubmit} fluid>Direct Message</Button>
          <Button
            disabled={isSubmitting}
            onClick={(e) => {
              resetForm();
              onClose(e);
              }
            }
            fluid
          >
            Cancel
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

const GET_OR_CREATE_CHANNEL = gql`
  mutation($teamId: Int!, $members: [Int!]!) {
    getOrCreateChannel(teamId: $teamId, members: $members)
  }
`;

export default compose(
  withRouter,
  graphql(GET_OR_CREATE_CHANNEL),
  withFormik({
    mapPropsToValues: () => ({ members: [] }),
    handleSubmit: async ({ members }, { props: { onClose, teamId, mutate }, setSubmitting }) => {
      const response = await mutate({
        variables: {
          members,
          teamId,
        },
      });
      console.log(response);
      onClose();
      setSubmitting(false);
    },
  }),
)(DirectMessageModal);
