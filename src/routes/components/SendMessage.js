import React from 'react';
import styled from 'styled-components';
import { withFormik } from 'formik';
import { Input, Button, Icon } from 'semantic-ui-react';

import FileUpload from './FileUpload';

const SendMessageWrapper = styled.div`
  grid-column: 3;
  margin: 20px;
  display: grid;
  grid-template-columns: 40px auto;
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
    <FileUpload>
      <Button icon>
        <Icon name="plus" />
      </Button>
    </FileUpload>
    <Input
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
