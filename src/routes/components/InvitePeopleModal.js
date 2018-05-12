import React from 'react';
import { Form, Modal, Input, Button } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';

import normalizeErrors from '../../normalizeErrors';

const inlineStyle = {
  modal: {
    marginTop: '0px !important',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
};

const InvitePeopleModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  touched,
  errors,
}) => (
  <Modal style={inlineStyle.modal} onClose={onClose} open={open} size="small">
    <Modal.Header>Add a member</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input
            type="email"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            name="email"
            fluid
            placeholder="New member's email"
          />
        </Form.Field>
        {touched.email && errors.email ? errors.email[0] : null}
        <Form.Group>
          <Button disabled={isSubmitting} onClick={handleSubmit} fluid>Add member</Button>
          <Button disabled={isSubmitting} onClick={onClose} fluid>Cancel</Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

const ADD_MEMBER = gql`
  mutation($email: String!, $teamId: Int!) {
    addMember(email: $email, teamId: $teamId) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default compose(
  graphql(ADD_MEMBER),
  withFormik({
    mapPropsToValues: () => ({ email: '' }),
    handleSubmit: async (
      values,
      {
        props: {
          onClose, teamId, mutate,
        }, setSubmitting, resetForm, setErrors,
      },
    ) => {
      const response = await mutate({
        variables: {
          teamId,
          email: values.email,
        },
      });
      const { ok, errors } = response.data.addMember;
      if (ok) {
        console.log(response);
        onClose();
        resetForm();
        setSubmitting(false);
      } else {
        setSubmitting(false);
        const errorsLength = errors.length;
        const filteredErrors = errors.filter(e => e.message !== 'user_id must be unique');
        if (errorsLength !== filteredErrors.length) {
          filteredErrors.push({
            path: 'email',
            message: 'This user is already a part of the team.',
          });
        }
        setErrors(normalizeErrors(filteredErrors));
      }
    },
  }),
)(InvitePeopleModal);
