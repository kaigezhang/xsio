import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Flex from 'shared/components/Flex';

import AccountMenu from 'menus/AccountMenu';
import Scrollable from 'components/Scrollable';
import HomeIcon from 'components/Icon/HomeIcon';
import EditIcon from 'components/Icon/EditIcon';
import SearchIcon from 'components/Icon/SearchIcon';
import StarredIcon from 'components/Icon/StarredIcon';

import { Section } from './Sidebar';
import Sidebar from './Sidebar.container';
import Collections from './components/Collections.container';
import Libraries from './components/Libraries.container';
import SidebarLink from './components/SidebarLink';
import HeaderBlock from './components/HeaderBlock';

const propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  auth: PropTypes.object,
  ui: PropTypes.object,
  // functions from ui
  setActiveModal: PropTypes.func,
};


class MainSidebar extends Component  {
  handleCreateCollection = () => {
    this.props.setActiveModal('collection-new');
  };

  handleEditCollection = () => {
    this.props.setActiveModal('collection-edit');
  };

  handleCreateLibrary = () => {
    this.props.setActiveModal('library-new');
  }

  render() {
    const { user, ui } = this.props;

    if (!user) return null;

    return (
      <Sidebar>
        <AccountMenu
          label={
            <HeaderBlock
              username={user.username}
              subheading={user.email}
              teamName={user.username}
            />
          }
        />

        <Flex auto column>
          <Scrollable>
            <Section>
              <SidebarLink to="/dashboard" icon={<HomeIcon />}>
                主页
              </SidebarLink>
              <SidebarLink to="/search" icon={<SearchIcon />}>
                搜索
              </SidebarLink>
              <SidebarLink to="/starred" icon={<StarredIcon />}>
                收藏
              </SidebarLink>

              <SidebarLink
                to="/drafts"
                icon={<EditIcon />}
                active={ui.activeDocument
                  ? !ui.activeDocument.publishedAt
                  : undefined}
              >
                草稿
              </SidebarLink>
            </Section>
            <Section>
              <Collections
                history={this.props.history}
                location={this.props.location}
                onCreateCollection={this.handleCreateCollection} />
            </Section>
            <Section>
              <Libraries
                history={this.props.history}
                location={this.props.location}
                onCreateLibrary={this.handleCreateLibrary}
              />
            </Section>
          </Scrollable>
        </Flex>
      </Sidebar>
    );
  }
}


export default withRouter(MainSidebar);
