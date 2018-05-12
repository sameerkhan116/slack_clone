import React, { Component } from 'react';
import { Form, Container, Header, Button, Message, Input } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class Register extends Component {
  // setting the state to handle store the fields and corresponding errors.
  state = {
    username: '',
    usernameError: '',
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
  };

  // the onChange function updates the state when any of the field is updated
  onChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  // the onSubmit function - first, we rest any errors in the state (to remove the red underline)
  // then we get the usernmae, email and password from the state and pass it as the variables for
  // the mutate function that we have in props (thanks to the wrapping the function in graphql
  // higher order function)
  onSubmit = async () => {
    this.setState({
      usernameError: '',
      emailError: '',
      passwordError: '',
    });
    const { username, email, password } = this.state;
    const response = await this.props.mutate({
      variables: { username, email, password },
    });

    // get ok / errors from the response.data.register
    const { ok, errors } = response.data.register;

    // if ok is true, redirect to the home page
    // otherwise, map the errors and set them in state.
    if (ok) {
      this.props.history.push('/login');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });
      this.setState(err);
    }
    console.log(response);
  };

  render() {
    const {
      username, email, password, usernameError, emailError, passwordError,
    } = this.state;

    // push any errors (if present), in the errorsList
    const errorList = [];

    if (usernameError) {
      errorList.push(usernameError);
    }
    if (emailError) {
      errorList.push(emailError);
    }
    if (passwordError) {
      errorList.push(passwordError);
    }

    return (
      <Container text>
        <Header as="h2">Register</Header>
        <Form>
          <Form.Field
            error={!!usernameError}
          >
            <Input
              name="username"
              onChange={this.onChange}
              value={username}
              placeholder="Username"
              fluid
            />
          </Form.Field>
          <Form.Field
            error={!!emailError}
          >
            <Input
              name="email"
              onChange={this.onChange}
              value={email}
              type="email"
              placeholder="Email"
              fluid
            />
          </Form.Field>
          <Form.Field
            error={!!passwordError}
          >
            <Input
              name="password"
              onChange={this.onChange}
              value={password}
              type="password"
              placeholder="Password"
              fluid
            />
          </Form.Field>
          <Button onClick={this.onSubmit} type="submit">Register</Button>
        </Form>
        {errorList.length ? (
          <Message error header="There was some error with your submission" list={errorList} />
        ) : null}
      </Container>
    );
  }
}

// the add user graphql mutation
const ADD_USER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(ADD_USER)(Register);
