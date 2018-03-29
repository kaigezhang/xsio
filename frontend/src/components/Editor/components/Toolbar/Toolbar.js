import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Portal } from 'react-portal';
import { view, store } from 'react-easy-state';

import { findDOMNode } from 'slate-react';
import styled from 'styled-components';
import FormattingToolbar from './components/FormattingToolbar';
import LinkToolbar from './components/LinkToolbar';


const getLinkInSelection = (value) => {
  try {
    const selectedLinks = value.document
      .getInlinesAtRange(value.selection)
      .filter(node => node.type === 'link');

    if (selectedLinks.size) {
      const link = selectedLinks.first();
      if (value.selection.hasEdgeIn(link)) return link;
    }
  } catch (err) {
    // It's okay.
  }
};


const propsTypes = {
  editor: PropTypes.object,
  value: PropTypes.object,
};


@view
export default class Toolbar extends Component {
  ui = store({
    active: false,
    link: undefined,
    top: '',
    left: '',
    mouseDown: false
  })

  componentDidMount() {
    this.update();
    if (this.context.parent) {
      this.context.parent.addEventListener('mousedown', this.handleMouseDown);
      this.context.parent.addEventListener('mouseup', this.handleMouseup);
    }
    // window.addEventListener('mousedown', this.handleMouseDown);
    // window.addEventListener('mouseup', this.handleMouseup);
  }

  componentDidUpdate() {
    this.update();
  }

  componentWillUnmount() {
    if (this.context.parent) {
      this
        .context
        .parent
        .removeEventListener('mousedown', this.handleMouseDown);
      this
        .context
        .parent
        .removeEventListener('mouseup', this.handleMouseup);
    }
  // window.removeEventListener('mousedown', this.handleMouseDown);
  // window.removeEventListener('mouseup', this.handleMouseup);
  }

  hideLinkToolbar = () => {
    this.ui.link = undefined;
  }

  handleMouseDown = () => {
    this.ui.mouseDown = true;
  }

  handleMouseup = () => {
    this.ui.mouseDown = false;
    this.update();
  }

  showLinkToolbar = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const link = getLinkInSelection(this.props.value);
    this.ui.link = link;
  }

  update = () => {
    const { value } = this.props;
    const link = getLinkInSelection(value);


    if (value.isBlurred || (value.isCollapsed && !link)) {
      if (this.ui.active && !this.ui.link) {
        this.ui.active = false;
        this.ui.link = undefined;
        this.ui.top = '';
        this.ui.left = '';
      }
      return;
    }

    // don't display toolbar for document title
    const firstNode = value.document.nodes.first();
    if (firstNode === value.startBlock) return;
    // don't display toolbar for code blocks, code-lines inline code.
    if (value.startBlock.type.match(/code/)) return;
    // don't show until user has released pointing device button
    if (this.ui.mouseDown) return;

    this.ui.active = true;
    this.ui.link = this.link || link;

    const padding = 16;
    const selection = window.getSelection();
    let rect;

    if (link) {
      rect = findDOMNode(link).getBoundingClientRect(); // eslint-disable-line
    } else if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      rect = range.getBoundingClientRect();
    }

    if (!rect && (rect.top === 0 && rect.left === 0)) return;

    /* eslint-disable no-mixed-operators */
    const left = rect.left + window.scrollX - (this.menu.offsetWidth / 2) + (rect.width / 2);
    this.ui.top = `${Math.round(rect.top + window.scrollY - this.menu.offsetHeight)}px`;
    this.ui.left = `${Math.round(Math.max(padding, left))}px`;

    /* eslint-enable no-mixed-operators */
  }

  setRef = (ref) => {
    this.menu = ref;
  }

  render() {
    const { top, left, active, link } = this.ui;
    const style = {
      top,
      left
    };

    return (
      <Portal>
        <Menu active={active} innerRef={this.setRef} style={style}>
          {
            link ? (
              <LinkToolbar
                {...this.props}
                link={link}
                onBlur={this.hideLinkToolbar}
              />
            ) : (
              <FormattingToolbar
                onCreateLink={this.showLinkToolbar}
                {...this.props}
              />
            )
          }
        </Menu>
      </Portal>
    );
  }
}


const Menu = styled.div`
  padding: 8px 16px;
  position: absolute;
  z-index: 2;
  top: -10000px;
  left: -10000px;
  opacity: 0;
  background-color: #2f3336;
  border-radius: 4px;
  transform: scale(0.95);
  transition: opacity 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275),
    transform 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition-delay: 250ms;
  line-height: 0;
  height: 40px;
  min-width: 300px;

  ${({ active }) =>
    active &&
  `
    transform: translateY(-6px) scale(1);
    opacity: 1;
  `};

  @media print {
    display: none;
  }
`;

Toolbar.contextTypes = {
  parent: PropTypes.any,
};
