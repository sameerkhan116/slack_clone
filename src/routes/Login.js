import React, { Component } from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Button, Input, Container, Header } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class Login extends Component {
  constructor(props) {
    super(props);
    extendObservable(this, {
      email: '',
      password: '',
    });
  }

  onChange = (e) => {
    const { name, value } = e.target;
    this[name] = value;
  }

  onSubmit = async () => {
    const { email, password } = this;
    const response = await this.props.mutate({
      variables: {
        email,
        password,
      },
    });

    const { ok, token, refreshToken } = response.data.login;

    if (ok) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  render() {
    const { email, password } = this;
    return (
      <Container text>
        <Header as="h2">Login</Header>
        <Input
          name="email"
          onChange={this.onChange}
          value={email}
          type="email"
          placeholder="Email"
          fluid
        />
        <Input
          name="password"
          onChange={this.onChange}
          value={password}
          type="password"
          placeholder="Password"
          fluid
        />
        <Button onClick={this.onSubmit}>Login</Button>
      </Container>
    );
  }
}

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
