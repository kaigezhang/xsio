import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Flex from 'shared/components/Flex';
import Scrollable from 'components/Scrollable';
import ProfileIcon from 'components/Icon/ProfileIcon';
import SettingsIcon from 'components/Icon/SettingsIcon';
import CodeIcon from 'components/Icon/CodeIcon';
import UserIcon from 'components/Icon/UserIcon';

import { Section } from './Sidebar';
import Sidebar from './Sidebar.container';
import Header from './components/Header';
import SidebarLink from './components/SidebarLink';
import HeaderBlock from './components/HeaderBlock';

const propTypes = {
  history: PropTypes.object,
  user: PropTypes.object,
};


class SettingsSidebar extends Component {
  returnToDashboard = () => {
    this.props.history.push('/dashboard');
  };

  render() {
    const { user } = this.props;
    if (!user) return;

    return (
      <Sidebar>
        <HeaderBlock
          subheading="◄ 返回管理面板"
          teamName={user.username}
          // logoUrl={user.profile.image}
          onClick={this.returnToDashboard}
        />

        <Flex auto column>
          <Scrollable>
            <Section>
              <Header>Account</Header>
              <SidebarLink to="/settings" icon={<ProfileIcon />}>
                Profile
              </SidebarLink>
              {/* <SidebarLink to="/settings/tokens" icon={<CodeIcon />}>
                API Tokens
              </SidebarLink> */}
            </Section>
            {/* <Section>
              <Header>Team</Header>
              <SidebarLink to="/settings/users" icon={<UserIcon />}>
                Users
              </SidebarLink>
              <SidebarLink
                to="/settings/integrations/slack"
                icon={<SettingsIcon />}
              >
                Integrations
              </SidebarLink>
            </Section> */}
          </Scrollable>
        </Flex>
      </Sidebar>
    );
  }
}

export default withRouter(SettingsSidebar);
