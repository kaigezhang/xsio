import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Portal } from 'react-portal';
import { findDOMNode } from 'slate-react';

import styled from 'styled-components';
import { color } from 'shared/styles/constants';
import PlusIcon from 'components/Icon/PlusIcon';

import { view, store } from 'react-easy-state';

const propTypes = {
  editor: PropTypes.object,
};


const findClosestRootNode = (value, ev) => {
  let previous;
  /* eslint-disable */
  for (const node of value.document.nodes) {
    const element = findDOMNode(node);
    const bounds = element.getBoundingClientRect();
    if (bounds.top > ev.clientY) return previous;
    previous = { node, element, bounds };
  }
  /* eslint-enable */

  return previous;
};

class BlockInsert extends Component {
  mouseMoveTimeout = 0
  mouseMovementSinceClick = 0
  lastClientX = 0
  lastClientY = 0


  ui = store({
    closestRootNode: undefined,
    active: false,
    top: 0,
    left: 0
  })

  componentDidMount = () => {
    if (this.context.parent) {
      this.context.parent.addEventListener('mousemove', this.handleMouseMove);
    }
  };

  componentWillUnmount = () => {
    if (this.context.parent) {
      this.context.parent.removeEventListener('mousemove', this.handleMouseMove);
    }
  }

  setInactive = () => {
    this.ui.active = false;
  }

  handleMouseMove = (ev) => {
    const windowWidth = window.innerWidth / 2.5;

    const result = findClosestRootNode(this.props.editor.value, ev);

    const movementThreshold = 200;

    this.mouseMovementSinceClick += Math.abs(this.lastClientX - ev.clientX) + Math.abs(this.lastClientY - ev.clientY);
    this.lastClientX = ev.clientX;
    this.lastClientY = ev.clientY;


    this.ui.active = ev.clientX < windowWidth && this.mouseMovementSinceClick > movementThreshold;

    if (result) {
      this.ui.closestRootNode = result.node;
      const firstNode = this.props.editor.value.document.nodes.first();
      if (result.node === firstNode || result.node.type === 'block-toolbar') {
        this.ui.left = -1000;
      } else {
        this.ui.left = Math.round(result.bounds.left - 30);
        this.ui.top = Math.round(result.bounds.top + window.scrollY);
      }
    }

    if (this.ui.active) {
      clearTimeout(this.mouseMoveTimeout);
      this.mouseMoveTimeout = setTimeout(this.setInactive, 2000);
    }
  }

  handleClick = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();

    this.mouseMovementSinceClick = 0;
    this.ui.active = false;

    const { editor } = this.props;
    console.log(editor, 'this.props.editor');

    editor.change((change) => {
      // remove any existing toolbars in the document as a fail safe
      editor.value.document.nodes.forEach((node) => {
        if (node.type === 'block-toolbar') {
          change.removeNodeByKey(node.key);
        }
      });

      change.collapseToStartOf(this.ui.closestRootNode);

      // if we're on an empty paragraph then just replace it with the block
      // toolbar. Otherwise insert the toolbar as an extra Node.
      if (
        !this.ui.closestRootNode.text &&
        this.ui.closestRootNode.type === 'paragraph'
      ) {
        change.setNodeByKey(this.ui.closestRootNode.key, {
          type: 'block-toolbar',
          isVoid: true,
        });
      } else {
        change.insertBlock({ type: 'block-toolbar', isVoid: true });
      }
    });
  }


  render() {
    const style = { top: `${this.ui.top}px`, left: `${this.ui.left}px` };
    return (
      <Portal>
        <Trigger active={this.ui.active} style={style}>
          <PlusIcon onClick={this.handleClick} color={color.slate} />
        </Trigger>
      </Portal>
    );
  }
}

const Trigger = styled.div`
  position: absolute;
  z-index: 1;
  opacity: 0;
  background-color: ${color.white};
  transition: opacity 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275),
    transform 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  line-height: 0;
  margin-left: -10px;
  box-shadow: inset 0 0 0 2px ${color.slate};
  border-radius: 100%;
  transform: scale(0.9);
  cursor: pointer;

  &:hover {
    background-color: ${color.slate};

    svg {
      fill: ${color.white};
    }
  }

  ${({ active }) =>
    active &&
  `
    transform: scale(1);
    opacity: .9;
  `};
`;

BlockInsert.contextTypes = {
  parent: PropTypes.any,
};

export default view(BlockInsert);
