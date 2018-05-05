import React from 'react';
import styled from 'styled-components';
import { withFormik } from 'formik';
import { Input } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
`;

const SendMessage = ({
  channelName,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) => (
  <SendMessageWrapper>
    <Input
      fluid
      placeholder={`Message  #${channelName}`}
      name="message"
      value={values.message}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.keyCode === 13 && !isSubmitting) {
          handleSubmit(e);
        }
      }}
    />
  </SendMessageWrapper>
);

const CREATE_MESSAGE = gql`
  mutation($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;

export default compose(
  graphql(CREATE_MESSAGE),
  withFormik({
    mapPropsToValues: () => ({ message: '' }),
    handleSubmit: async (values, {
      props: {
        channelId,
        mutate,
      },
      setSubmitting,
      resetForm,
    }) => {
      if (!values.message || !values.message.trim()) {
        setSubmitting(false);
        return;
      }
      await mutate({
        variables: {
          channelId,
          text: values.message,
        },
      });
      resetForm(false);
    },
  }),
)(SendMessage);
