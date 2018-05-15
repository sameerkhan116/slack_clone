import React from 'react';
import { Form, Modal, Input, Button, Checkbox } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import { findIndex } from 'lodash';

import { ME as query } from '../graphql/team';
import MultiSelectUsers from './MultiSelectUsers';

const inlineStyle = {
  modal: {
    marginTop: '0px !important',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
};

const AddChannelModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  resetForm,
  setFieldValue,
  teamId,
}) => (
  <Modal
    style={inlineStyle.modal}
    onClose={(e) => {
      resetForm();
      onClose(e);
    }}
    open={open}
    size="small"
  >
    <Modal.Header>Add a channel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            name="name"
            fluid
            placeholder="Channel name"
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            toggle
            checked={!values.public}
            label="Private channel"
            onChange={(e, { checked }) => setFieldValue('public', !checked)}
          />
        </Form.Field>
        <Form.Field>
          {values.public
            ? null
            : (
              <MultiSelectUsers
                values={values.members}
                handleChange={(e, { value }) => setFieldValue('members', value)}
                placeholder="Selected users"
                teamId={teamId}
              />
              )
          }
        </Form.Field>
        <Form.Group>
          <Button disabled={isSubmitting} onClick={handleSubmit} fluid>Create channel</Button>
          <Button
            disabled={isSubmitting}
            onClick={(e) => {
              resetForm();
              onClose(e);
            }}
            fluid
          >
            Cancel
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

const CREATE_CHANNEL = gql`
  mutation($teamId: Int!, $name: String!, $public: Boolean, $members: [Int!]) {
    createChannel(teamId: $teamId, name: $name, public: $public, members: $members) {
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
    mapPropsToValues: () => ({ public: true, name: '', members: [] }),
    handleSubmit: async (
      values,
      {
        props: {
          onClose, teamId, mutate,
        }, setSubmitting,
      },
    ) => {
      const response = await mutate({
        variables: {
          teamId,
          name: values.name,
          public: values.public,
          members: values.members,
        },
        optimisticResponse: {
          createChannel: {
            __typename: 'ChannelResponse',
            ok: true,
            channel: {
              __typename: 'Channel',
              id: -1,
              name: values.name,
            },
          },
        },
        update: (store, { data: { createChannel: { ok, channel } } }) => {
          if (!ok) return;
          const data = store.readQuery({ query });
          console.log(data);
          const teamIdx = findIndex(data.me.teams, ['id', teamId]);
          data.me.teams[teamIdx].channels.push(channel);
          store.writeQuery({ query, data });
        },
      });
      console.log(response);
      onClose();
      setSubmitting(false);
    },
  }),
)(AddChannelModal);
