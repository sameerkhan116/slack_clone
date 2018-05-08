import React, { Component } from 'react';

import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/AddChannelModal';
import InvitePeopleModal from '../components/InvitePeopleModal';

class Sidebar extends Component {
  state = {
    openAddChannelModal: false,
    openInvitePeopleModal: false,
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

  render() {
    const { teams, team, username } = this.props;
    const { openAddChannelModal, openInvitePeopleModal } = this.state;

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
        channels={team.channels}
        users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }]}
        onAddChannel={this.toggleAddChannelModal}
        onInvitePeople={this.toggleInvitePeopleModal}
      />,
      <AddChannelModal
        teamId={team.id}
        onClose={this.toggleAddChannelModal}
        open={openAddChannelModal}
        key="sidebar-add-channel-modal"
      />,
      <InvitePeopleModal
        teamId={team.id}
        onClose={this.toggleInvitePeopleModal}
        open={openInvitePeopleModal}
        key="sidebar-invite-people-modal"
      />,
    ];
  }
}

export default Sidebar;
