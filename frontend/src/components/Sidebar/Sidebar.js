// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import breakpoint from 'styled-components-breakpoint';
import Flex from 'shared/components/Flex';
import { color, layout } from 'shared/styles/constants';

import CloseIcon from 'components/Icon/CloseIcon';
import MenuIcon from 'components/Icon/MenuIcon';

/* TODO ui 中的所有属性是否需要抽离出来 */
const propTypes = {
  children: PropTypes.node,
  history: PropTypes.object,
  location: PropTypes.object,
  auth: PropTypes.object,
  documents: PropTypes.object,
  ui: PropTypes.object,
  hideMobileSidebar: PropTypes.func,
  toggleMobileSidebar: PropTypes.func,
};

class Sidebar extends Component {
  componentWillReceiveProps = (nextProps) => {
    if (this.props.location !== nextProps.location) {
      this.props.hideMobileSidebar();
    }
  };

  toggleSidebar = () => {
    this.props.toggleMobileSidebar();
  };

  render() {
    const { children, ui } = this.props;

    return (
      <Container
        editMode={ui.editMode}
        mobileSidebarVisible={ui.mobileSidebarVisible}
        column
      >
        <Toggle
          onClick={this.toggleSidebar}
          mobileSidebarVisible={ui.mobileSidebarVisible}
        >
          {ui.mobileSidebarVisible ? <CloseIcon /> : <MenuIcon />}
        </Toggle>
        {children}
      </Container>
    );
  }
}

const Container = styled(Flex)`
  position: fixed;
  top: 0;
  bottom: 0;
  left: ${props => (props.editMode ? `-${layout.sidebarWidth}` : 0)};
  width: 100%;
  background: ${color.smoke};
  transition: left 200ms ease-in-out;
  margin-left: ${props => (props.mobileSidebarVisible ? 0 : '-100%')};
  z-index: 1;

  @media print {
    display: none;
    left: 0;
  }

  ${breakpoint('tablet')`
    width: ${layout.sidebarWidth};
    margin: 0;
  `};
`;

export const Section = styled(Flex)`
  flex-direction: column;
  margin: 24px 0;
  padding: 0 24px;
  position: relative;
`;

const Toggle = styled.a`
  position: fixed;
  top: 0;
  left: ${props => (props.mobileSidebarVisible ? 'auto' : 0)};
  right: ${props => (props.mobileSidebarVisible ? 0 : 'auto')};
  z-index: 1;
  margin: 16px;

  ${breakpoint('tablet')`
    display: none;
  `};
`;

export default withRouter(Sidebar);
