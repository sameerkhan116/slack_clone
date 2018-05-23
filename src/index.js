import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo'; // to wrap component in so we can do graphql stuff

import 'semantic-ui-css/semantic.min.css'; // for semantic ui reeact

import client from './apollo'; // import the client with HTTP and WS set up that we created.
import Routes from './routes'; // the routes component.
import registerServiceWorker from './registerServiceWorker'; // for PWA.

const App = (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

ReactDOM.render(App, document.getElementById('root'));
registerServiceWorker();
