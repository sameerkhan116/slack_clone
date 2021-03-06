import React, { Component } from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Form, Message, Button, Input, Container, Header } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import { wsLink } from '../apollo';

// this form is similar to the Login form, except we use mobx to keep the state.
// instead of a state, we use the extendObservable function in the constructor and
// then give it the fields we would have used in the state. After this, we wrap the
// class in a higher order 'observer' function when exporting, and this function in
// turn is wrapped by the graphql higher order function.
class Login extends Component {
  constructor(props) {
    super(props);
    extendObservable(this, {
      email: '',
      password: '',
      errors: {},
    });
  }

  onChange = (e) => {
    const { name, value } = e.target;
    this[name] = value;
  }

  onSubmit = async () => {
    this.errors = {};
    const { email, password } = this;
    const response = await this.props.mutate({
      variables: {
        email,
        password,
      },
    });

    const {
      ok, token, refreshToken, errors,
    } = response.data.login;

    if (ok) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      wsLink.subscriptionClient.tryReconnect();
      this.props.history.push('/view-team');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });

      this.errors = err;
    }
  }

  render() {
    const { email, password, errors: { emailError, passwordError } } = this;
    const errorList = [];
    if (emailError) {
      errorList.push(emailError);
    }
    if (passwordError) {
      errorList.push(passwordError);
    }


    return (
      <Container text>
        <Header as="h2">Login</Header>
        <Form>
          <Form.Field error={!!emailError}>
            <Input
              name="email"
              onChange={this.onChange}
              value={email}
              type="email"
              placeholder="Email"
              fluid
            />
          </Form.Field>
          <Form.Field error={!!passwordError}>
            <Input
              name="password"
              onChange={this.onChange}
              value={password}
              type="password"
              placeholder="Password"
              fluid
            />
          </Form.Field>
          <Button onClick={this.onSubmit}>Login</Button>
        </Form>
        {errorList.length ? (
          <Message error header="There was some error with your submission" list={errorList} />
        ) : null}
      </Container>
    );
  }
}

// the Login mutation
const LOGIN_MUTATION = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(LOGIN_MUTATION)(observer(Login));
