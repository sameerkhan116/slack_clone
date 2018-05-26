import React from 'react'; // for rendering components
import { Form, Modal, Input, Button, Checkbox } from 'semantic-ui-react';
import { withFormik } from 'formik'; // for creating forms with lots of helpful props
import gql from 'graphql-tag'; // for writing graphql queries
// compose to combine multiple HOCs, graphql for wrapping component to get graphql props
import { compose, graphql } from 'react-apollo';
import { findIndex } from 'lodash'; // for finding index of channels and teams etc.

import { ME as query } from '../graphql/team'; // for updating cache, we need this query.
import MultiSelectUsers from './MultiSelectUsers'; // the multiselectusers component.

// inline styles for modal since default styling is not working.
const inlineStyle = {
  modal: {
    marginTop: '0px !important',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
};

// AddChannelModal that is exported by default. Get a lot of helpful props on it thanks to
// withFormik. Also get some other props from parent.
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
  currentUserId,
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
                currentUserId={currentUserId}
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

// the create_channel mutation. For this we need the teamId from props, the value for public
// or private the name and members come from the formik fields in the formik form.
const CREATE_CHANNEL = gql`
  mutation($teamId: Int!, $name: String!, $public: Boolean, $members: [Int!]) {
    createChannel(teamId: $teamId, name: $name, public: $public, members: $members) {
      ok
      channel {
        id
        name
        dm
      }
    }
  }
`;

export default compose(
  graphql(CREATE_CHANNEL), // the create channel mutation
  withFormik({ // wrapping the component with withFormik
    mapPropsToValues: () => ({ public: true, name: '', members: [] }), // the values that we need from the form
    // the handleSubmit function that is made available as a prop in the form
    handleSubmit: async (
      values,
      {
        props: {
          onClose, teamId, mutate,
        }, setSubmitting,
      },
    ) => {
      // the response is what we get when we run the mutation with the required variables.
      const response = await mutate({
        variables: {
          teamId,
          name: values.name,
          public: values.public,
          members: values.members,
        },
        // optimisticResponse for updating the cache and displaying the result of running the
        // query almost immediately instead of needing to refresh the page.
        optimisticResponse: {
          createChannel: {
            __typename: 'Mutation',
            ok: true,
            channel: {
              __typename: 'Channel',
              id: -1,
              name: values.name,
              dm: false,
            },
          },
        },
        // use the results of the response to update our cache.
        update: (store, { data: { createChannel: { ok, channel } } }) => {
          if (!ok) return; // if the response is not ok, then no cache update done.
          // otherwise read the query that we need to update.
          const data = store.readQuery({ query });
          // console.log(data);
          // get the teamIndex using the previous query where id is the currentTeamId
          const teamIdx = findIndex(data.me.teams, ['id', teamId]);
          // push this new channel on the channels for this team. By default, the type dm
          // for the channel will be false and we also need to specify the typename for
          // what we are pushing which in this case is a Channel.
          data.me.teams[teamIdx].channels.push({
            __typename: 'Channel',
            ...channel,
            dm: false,
          });
          // write the updated query back to cache.
          store.writeQuery({ query, data });
        },
      });
      console.log(response);
      onClose();
      setSubmitting(false);
    },
  }),
)(AddChannelModal);
