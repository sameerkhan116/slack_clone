import React from 'react';
import { Form, Modal, Input, Button } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import { findIndex } from 'lodash';

import { ALL_TEAMS } from '../grapqhl/team';

const inlineStyle = {
  modal: {
    marginTop: '0px !important',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
};

const AddChannelModal = ({
  open, onClose, values, handleChange, handleBlur, handleSubmit, isSubmitting,
}) => (
  <Modal style={inlineStyle.modal} onClose={onClose} open={open} size="small">
    <Modal.Header>Add a channel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input value={values.name} onChange={handleChange} onBlur={handleBlur} name="name" fluid placeholder="Channel name" />
        </Form.Field>
        <Form.Group>
          <Button disabled={isSubmitting} onClick={handleSubmit} fluid>Create channel</Button>
          <Button disabled={isSubmitting} onClick={onClose} fluid>Cancel</Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

const CREATE_CHANNEL = gql`
  mutation($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name) {
      ok
      channel {
        id
        name
      }
    }
  }
`;

export default compose(
  graphql(CREATE_CHANNEL),
  withFormik({
    mapPropsToValues: () => ({ name: '' }),
    handleSubmit: async (
      values,
      {
        props: {
          onClose, teamId, mutate,
        }, setSubmitting, resetForm,
      },
    ) => {
      const response = await mutate({
        variables: {
          teamId,
          name: values.name,
        },
        optimisticResponse: {
          createChanneL: {
            _typename: 'Mutation',
            ok: true,
            channel: {
              _typename: 'Channel',
              id: -1,
              name: values.name,
            },
          },
        },
        update: (store, { data: { createChannel: { ok, channel } } }) => {
          if (!ok) return;
          const data = store.readQuery({ query: ALL_TEAMS });
          console.log(data);
          const teamIdx = findIndex(data.allTeams, ['id', teamId]);
          data.allTeams[teamIdx].channels.push(channel);
          store.writeQuery({ query: ALL_TEAMS, data });
        },
      });
      console.log(response);
      onClose();
      resetForm();
      setSubmitting(false);
    },
  }),
)(AddChannelModal);
