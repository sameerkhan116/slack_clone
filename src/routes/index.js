import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import decode from 'jwt-decode'; // for decoding the jwt tokens

import Home from './Home';
import Register from './Register';
import Login from './Login';
import CreateTeam from './CreateTeam';
import ViewTeam from './ViewTeam';
import DirectMessage from './DirectMessage';

// the isAuthenticated function. We get the token and refresh token from the
// localStorage and decode it. if it works, we can return true otherwise we
// return false.
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    decode(token);
    decode(refreshToken);
  } catch (err) {
    return false;
  }
  return true;
};

// For protecting routes. We check if the router is authenticated using the
// isAuthenticated function. If it is, we can render the componennt. Otherwise,
// we can Redirect the user where we need them to.
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/login' }} />
      )
  )}
  />
);

// the routes component that we are using in index.js.
// we use react-router to create the links with exact paths.
export default () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/login" component={Login} />
      <PrivateRoute exact path="/view-team/dm/:teamId?/:receiverId" component={DirectMessage} />
      <PrivateRoute exact path="/view-team/:teamId?/:channelId?" component={ViewTeam} />
      <PrivateRoute exact path="/create-team" component={CreateTeam} />
    </Switch>
  </Router>
);
