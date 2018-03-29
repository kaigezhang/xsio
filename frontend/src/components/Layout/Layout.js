import React, { PureComponent } from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import breakpoint from 'styled-components-breakpoint';

import keydown from 'react-keydown';
import Flex from 'shared/components/Flex';
import { layout } from 'shared/styles/constants';
import { documentEditUrl, homeUrl, searchUrl } from 'utils/routeHelpers';


import { LoadingIndicatorBar } from 'components/LoadingIndicator';
import Sidebar from 'components/Sidebar';
import SettingsSidebar from 'components/Sidebar/Settings.container';
import Modals from 'components/Modals';
import Toasts from 'components/Toasts';
import ErrorSuspended from 'scenes/ErrorSuspended';


const propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  documents: PropTypes.object,
  children: PropTypes.node,
  actions: PropTypes.node,
  title: PropTypes.node,
  user: PropTypes.object,
  notifications: PropTypes.node,
};


class Layout extends PureComponent {
  @keydown(['/', 't'])
  goToSearch(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.history.push(searchUrl());
  }

  @keydown('d')
  goToDashboard() {
    this.props.history.push(homeUrl());
  }

  @keydown('e')
  goToEdit(e) {
    // 可以引入store来替换
    const activeDocument = this.props.documents.active;
    if (!activeDocument) return null;

    e.preventDefault();
    e.stopPropagation();

    this.props.history.push(documentEditUrl(activeDocument));
  }

  @keydown('shift+/')
  openKeyboardShortcuts() {
    this.props.setActiveModal('keyboard-shortcuts');
  }

  render() {
    const { user, notifications, ui } = this.props;
    const { progressBarVisible } = ui;
    if (user && user.isSuspended) return <ErrorSuspended />;
    const showSidebar = !!user;
    return (
      <Container column auto>
        <Helmet>
          <title>Xueshu.io</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link
            rel="shortcut icon"
            type="image/png"
            href="/favicon-16.png"
            sizes="16x16"
          />
          <link
            rel="shortcut icon"
            type="image/png"
            href="/favicon-32.png"
            sizes="32x32"
          />
        </Helmet>

        { progressBarVisible  && <LoadingIndicatorBar />}
        { notifications }

        <Flex auto>
          {
            showSidebar && (
              <Switch>
                <Route path="/settings" component={SettingsSidebar} />
                <Route component={Sidebar} />
              </Switch>
            )
          }

          <Content auto justify="center" editMode={ui.editMode}>
            { this.props.children }
          </Content>
        </Flex>

        <Modals />
        <Toasts />
      </Container>
    );
  }
}

const Container = styled(Flex)`
  position: relative;
  width: 100%;
  height: 100%;
`;


const Content = styled(Flex)`
  margin: 0;
  transition: margin-left 200ms ease-in-out;

  @media print {
    margin: 0;
  }

  ${breakpoint('tablet')`
    margin-left: ${props => (props.editMode ? 0 : layout.sidebarWidth)};
  `};
`;

export default withRouter(Layout);
