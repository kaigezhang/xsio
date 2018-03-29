import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { color, fontWeight } from 'shared/styles/constants';
import styled from 'styled-components';
import Flex from 'shared/components/Flex';
import CollapsedIcon from 'components/Icon/CollapsedIcon';


const activeStyle = {
  color: color.black,
  fontWeight: fontWeight.medium
};


const StyledGoTo = styled(CollapsedIcon)`
  margin-bottom: -4px;
  margin-left: 1px;
  margin-right: -3px;
  ${({ expanded }) => !expanded && 'transform: rotate(-90deg);'};
`;

const IconWrapper = styled.span`
  margin-left: -4px;
  margin-right: 4px;
  height: 24px;
`;


const StyledNavLink = styled(NavLink)`
  display: flex;
  width: 100%;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 4px 0;
  margin-left: ${({ iconvisible }) => (iconvisible ? '-20px' : '0')};
  color: ${color.slateDark};
  font-size: 15px;
  cursor: pointer;

  &:hover {
    color: ${color.text};
  }
`;

const StyledDiv = StyledNavLink.withComponent('div');


const propTypes = {
  to: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  icon: PropTypes.node,
  expand: PropTypes.bool,
  expandedContent: PropTypes.node,
  hideExpandToggle: PropTypes.bool,
  iconColor: PropTypes.string,
  active: PropTypes.bool,
};


class SidebarLink extends Component  {
  state = {
    expanded: false
  }

  componentDidMount() {
    if (this.props.expand) this.handleExpand();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.expand) this.handleExpand();
  }

  handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      expanded: !this.state.expanded
    });
  }

  handleExpand = () => {
    this.setState({
      expanded: true
    });
  }

  render() {
    const {
      icon,
      children,
      onClick,
      to,
      expandedContent,
      expand,
      active,
      hideExpandToggle,
    } = this.props;

    const Component = to ? StyledNavLink : StyledDiv;
    const showExpandIcon = expandedContent && !hideExpandToggle;

    return (
      <Flex column>
        <Component
          iconvisible={showExpandIcon ? 1 : 0}
          activeStyle={activeStyle}
          style={active ? activeStyle : undefined}
          onClick={onClick}
          to={to}
          exact
        >
          {icon && <IconWrapper>{icon}</IconWrapper>}
          {showExpandIcon && (
            <StyledGoTo expanded={this.state.expanded} onClick={this.handleClick} />
          )}
          <Content onClick={this.handleExpand}>{children}</Content>
        </Component>

        {/* Collection */ expand && hideExpandToggle && expandedContent}
        {/* Document */ this.state.expanded && !hideExpandToggle && expandedContent}
      </Flex>
    );
  }
}


const Content = styled.div`
  width: 100%;
`;

export default SidebarLink;
