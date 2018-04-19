import React, { Component } from 'react';
import { Container, Header, Button, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class Register extends Component {
  state = {
    username: '',
    email: '',
    password: '',
  }

  onChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  onSubmit = async () => {
    const response = await this.props.mutate({
      variables: this.state
    });
    console.log(response);
  };

  render() {
    const { username, email, password } = this.state;

    return (
      <Container>
        <Header as='h1'>Register</Header>
        <Form onSubmit={this.onSubmit}>
          <Form.Field>
            <label>Username</label>
            <input 
              name="username" 
              onChange={this.onChange} 
              value={username} 
              placeholder='Username' />
          </Form.Field>
          <Form.Field>
            <label>Email</label>
            <input 
              name="email" onChange={this.onChange} value={email} type="email" placeholder='Email' />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input name="password" onChange={this.onChange} value={password} type="password" placeholder='Password' />
          </Form.Field>
          <Button type="submit">Register</Button>
        </Form>
      </Container>
    );
  }
}

const ADD_USER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password)
  }
`;

export default graphql(ADD_USER)(Register);