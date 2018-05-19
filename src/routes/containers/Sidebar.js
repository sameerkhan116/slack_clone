import React, { Component } from 'react';

import Channels from '../components/Channels';
import Teams from '../components/Teams';

import AddChannelModal from '../components/AddChannelModal';
import InvitePeopleModal from '../components/InvitePeopleModal';
import DirectMessageModal from '../components/DirectMessageModal';

class Sidebar extends Component {
  state = {
    openAddChannelModal: false,
    openInvitePeopleModal: false,
    openDirectMessageModal: false,
  }

  toggleAddChannelModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState(state => ({ openAddChannelModal: !state.openAddChannelModal }));
  }

  toggleInvitePeopleModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState(state => ({ openInvitePeopleModal: !state.openInvitePeopleModal }));
  }

  toggleDirectMessageModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState(state => ({ openDirectMessageModal: !state.openDirectMessageModal }));
  }

  render() {
    const {
      teams, team, username, currentUserId,
    } = this.props;
    const { openAddChannelModal, openInvitePeopleModal, openDirectMessageModal } = this.state;
    const regularChannels = [];
    const dmChannels = [];

    team.channels.forEach((c) => {
      if (c.dm) dmChannels.push(c);
      else regularChannels.push(c);
    });

    return [
      <Teams
        key="team-sidebar"
        teams={teams}
      />,
      <Channels
        key="channel-sidebar"
        teamname={team.name}
        username={username}
        teamId={team.id}
        isOwner={team.admin}
        channels={regularChannels}
        dmChannels={dmChannels}
        onAddChannel={this.toggleAddChannelModal}
        onInvitePeople={this.toggleInvitePeopleModal}
        directMessageClick={this.toggleDirectMessageModal}
      />,
      <AddChannelModal
        teamId={team.id}
        onClose={this.toggleAddChannelModal}
        open={openAddChannelModal}
        key="sidebar-add-channel-modal"
        currentUserId={currentUserId}
      />,
      <InvitePeopleModal
        teamId={team.id}
        onClose={this.toggleInvitePeopleModal}
        open={openInvitePeopleModal}
        key="sidebar-invite-people-modal"
      />,
      <DirectMessageModal
        teamId={team.id}
        onClose={this.toggleDirectMessageModal}
        open={openDirectMessageModal}
        key="sidebar-direct-message-modal"
        currentUserId={currentUserId}
      />,
    ];
  }
}

export default Sidebar;
