import { ApolloClient } from 'apollo-client'; // for creating the apollo-client
import { InMemoryCache } from 'apollo-cache-inmemory'; // for caching in the apollo client
import { setContext } from 'apollo-link-context'; // to set the headers from localStorage
import { ApolloLink, split } from 'apollo-link'; // ApolloLink required for ApolloClient
import { WebSocketLink } from 'apollo-link-ws'; // WSLink for setting up subscriptions
import { getMainDefinition } from 'apollo-utilities'; // to split queries based on query type

import createFileLink from './createFileLink'; // our personal implementation of the createHTTPLink

// creating an HTTPLink with the uri pointing to the graphql enpoint of the server
const httpLink = createFileLink({
  uri: 'http://localhost:3000/graphql',
});

// The setContext function takes a function that returns either an object or a promise
// that returns an object to set the new context of a request. Here, we are setting the
// headers using the token and refreshToken in localStorage
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  return {
    headers: {
      ...headers,
      'x-token': token,
      'x-refresh-token': refreshToken,
    },
  };
});

// afterware runs after the request has been made. forward specifies the next link in the
// chain of links, operation refers to the operation being made. Context contains the
// metadata and we get it using getContext(). From this, we get the headers and set the
// token and refreshToken in the localStorage from the headers.
const afterwareLink = new ApolloLink((operation, forward) => forward(operation).map((response) => {
  const { response: { headers } } = operation.getContext();
  if (headers) {
    const token = headers.get('x-token');
    const refreshToken = headers.get('x-refresh-token');
    if (token) {
      localStorage.setItem('token', token);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }
  return response;
}));

// creating a websocketlink for setting up subscriptions. We need to pass it some additional
// options such as lazy true so that it fetches the token and refreshToken everytime and
// updates them on every login, instead of using the ones from the previous localStorage.
export const wsLink = new WebSocketLink({
  uri: 'ws://localhost:3000/subscriptions',
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: {
      token: localStorage.getItem('token'),
      refreshToken: localStorage.getItem('refreshToken'),
    },
  },
});

// the final apollo link creating by concatenating the above links.
const conLink = afterwareLink.concat(authLink.concat(httpLink));

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  conLink,
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
