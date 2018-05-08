import React from 'react';
import styled from 'styled-components';
import { withFormik } from 'formik';
import { Input } from 'semantic-ui-react';

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
`;

const SendMessage = ({
  placeholder,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) => (
  <SendMessageWrapper>
    <Input
      fluid
      placeholder={`Message  #${placeholder}`}
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

export default withFormik({
  mapPropsToValues: () => ({ message: '' }),
  handleSubmit: async (values, {
    props: {
      onSubmit,
    },
    setSubmitting,
    resetForm,
  }) => {
    if (!values.message || !values.message.trim()) {
      setSubmitting(false);
      return;
    }
    await onSubmit(values.message);
    resetForm(false);
  },
})(SendMessage);
