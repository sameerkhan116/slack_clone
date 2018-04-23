import React from 'react';

import AppLayout from './components/AppLayout';
import Sidebar from './containers/Sidebar';
import Header from './components/Header';
import Messages from './components/Messages';
import SendMessage from './components/SendMessage';

export default () => (
  <AppLayout>
    <Sidebar currentTeamId={5} />
    <Header channelName="general" />
    <Messages>
      <ul className="message-list">
        <li />
        <li />
      </ul>
    </Messages>
    <SendMessage channelName="general" />
  </AppLayout>
);
