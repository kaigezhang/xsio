// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import styled from 'styled-components';
import { PortalWithState } from 'react-portal';
import Flex from 'shared/components/Flex';
import { color } from 'shared/styles/constants';
import { fadeAndScaleIn } from 'shared/styles/animations';

const propTypes = {
  label: PropTypes.node,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

class DropdownMenu extends Component {
  state = {
    top: 0,
    right: 0,
  }

  handleOpen = openPortal => (ev) => {
    ev.persist();
    ev.preventDefault();
    const currentTarget = ev.currentTarget;
    invariant(document.body, 'why you not here');

    if (currentTarget instanceof HTMLDivElement) {
      const bodyRect = document.body.getBoundingClientRect();
      const targetRect = currentTarget.getBoundingClientRect();
      const top = targetRect.bottom - bodyRect.top;
      const right = bodyRect.width - targetRect.left - targetRect.width;
      this.setState({
        top,
        right
      },
      () => openPortal(ev));
    }
  };

  render() {
    const { className, label, children } = this.props;

    return (
      <div className={className}>
        <PortalWithState
          onOpen={this.props.onOpen}
          onClose={this.props.onClose}
          closeOnOutsideClick
          closeOnEsc
        >
          {({ closePortal, openPortal, portal }) => (
            <React.Fragment>
              <Label onClick={this.handleOpen(openPortal)}>{label}</Label>
              {portal(
                <Menu
                  onClick={(ev) => {
                    ev.stopPropagation();
                    closePortal();
                  }}
                  style={this.props.style}
                  top={this.state.top}
                  right={this.state.right}
                >
                  {children}
                </Menu>
              )}
            </React.Fragment>
          )}
        </PortalWithState>
      </div>
    );
  }
}

const Label = styled(Flex).attrs({
  justify: 'center',
  align: 'center',
})`
  z-index: 1000;
  cursor: pointer;
`;

const Menu = styled.div`
  animation: ${fadeAndScaleIn} 200ms ease;
  transform-origin: 75% 0;

  position: absolute;
  right: ${({ right }) => right}px;
  top: ${({ top }) => top}px;
  z-index: 1000;
  border: ${color.slateLight};
  background: ${color.white};
  border-radius: 2px;
  min-width: 160px;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.08),
    0 2px 4px rgba(0, 0, 0, 0.08);

  @media print {
    display: none;
  }
`;

DropdownMenu.propTypes = propTypes;
export default DropdownMenu;
