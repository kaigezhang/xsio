import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import keydown from 'react-keydown';
import styled from 'styled-components';
import getDataTransferFiles from 'utils/getDataTransferFiles';

import Heading1Icon from 'components/Icon/Heading1Icon';
import Heading2Icon from 'components/Icon/Heading2Icon';
import BlockQuoteIcon from 'components/Icon/BlockQuoteIcon';
import ImageIcon from 'components/Icon/ImageIcon';
import CodeIcon from 'components/Icon/CodeIcon';
import BulletedListIcon from 'components/Icon/BulletedListIcon';
import OrderedListIcon from 'components/Icon/OrderedListIcon';
import HorizontalRuleIcon from 'components/Icon/HorizontalRuleIcon';
import TodoListIcon from 'components/Icon/TodoListIcon';

import Flex from 'shared/components/Flex';
import { color } from 'shared/styles/constants';
import { fadeIn } from 'shared/styles/animations';


import ToolbarButton from './components/ToolbarButton';
import { splitAndInsertBlock } from '../../changes';


class BlockToolbar extends Component {
  componentDidMount() {
    window.addEventListener('click', this.handleOutsideMouseClick);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleOutsideMouseClick);
  }

  handleOutsideMouseClick = (ev) => {
    const element = findDOMNode(this.bar); //eslint-disable-line

    if (
      !element ||
      (ev.target instanceof Node && element.contains(ev.target)) ||
      (ev.button && ev.button !== 0)
    ) {
      return;
    }
    this.removeSelf(ev);
  }

  @keydown('esc')
  removeSelf(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    this
      .props
      .editor
      .change(change => change.removeNodeByKey(this.props.node.key));
  }

  insertBlock = (options, cursorPosition) => {
    const { editor } = this.props;
    editor.change((change) => {
      change.collapseToEndOf(this.props.node)
        .call(splitAndInsertBlock, options)
        .removeNodeByKey(this.props.node.key)
        .collapseToEnd();
      if (cursorPosition === 'before') change.collapseToStartOfPreviousBlock();
      if (cursorPosition === 'after') change.collapseToStartOfNextBlock();
      return change.focus();
    });
  }

  handleClickBlock = (ev, type) => {
    ev.preventDefault();

    switch (type) {
    case 'heading1':
    case 'heading2':
    case 'block-quote':
    case 'code':
      return this.insertBlock({ type });
    case 'horizontal-rule':
      return this.insertBlock(
        {
          type: { type: 'horizontal-rule', isVoid: true },
        },
        'after'
      );
    case 'bulleted-list':
      return this.insertBlock({
        type: 'list-item',
        wrapper: 'bulleted-list',
      });
    case 'ordered-list':
      return this.insertBlock({
        type: 'list-item',
        wrapper: 'ordered-list',
      });
    case 'todo-list':
      return this.insertBlock({
        type: { type: 'list-item', data: { checked: false } },
        wrapper: 'todo-list',
      });
    case 'image':
      return this.onPickImage();
    default:
    }
  }

  onPickImage = () => {
    // simulate a click on the file upload input element
    this.file.click();
  };

  onImagePicked = async (ev) => {
    const files = getDataTransferFiles(ev);
    /* eslint-disable */
    for (const file of files) {
      await this.props.onInsertImage(file);
    }
    /* eslint-enable */
  }

  renderBlockButton = (type, IconClass) => (
    <ToolbarButton onMouseDown={ev => this.handleClickBlock(ev, type)}>
      <IconClass color={color.text} />
    </ToolbarButton>
  )

  render() {
    const { editor, attributes, node } = this.props;
    const active = editor.value.isFocused && editor.value.selection.hasEdgeIn(node);

    return (
      <Bar active={active} {...attributes} ref={ref => this.bar = ref}>
        <HiddenInput
          type="file"
          innerRef={ref => this.file = ref}
          onChange={this.onImagePicked}
          accept="image/*"
        />

        {this.renderBlockButton('heading1', Heading1Icon)}
        {this.renderBlockButton('heading2', Heading2Icon)}
        <div style={{
          height: '100%',
          width: '1px',
          background: '#E8EBED',
          display: 'inline-block',
          marginLeft: '10px'
        }} />
        {this.renderBlockButton('bulleted-list', BulletedListIcon)}
        {this.renderBlockButton('ordered-list', OrderedListIcon)}
        {this.renderBlockButton('todo-list', TodoListIcon)}
        <div style={{
          height: '100%',
          width: '1px',
          background: '#E8EBED',
          display: 'inline-block',
          marginLeft: '10px'
        }} />
        {this.renderBlockButton('block-quote', BlockQuoteIcon)}
        {this.renderBlockButton('code', CodeIcon)}
        {this.renderBlockButton('horizontal-rule', HorizontalRuleIcon)}
        {this.renderBlockButton('image', ImageIcon)}
      </Bar>
    );
  }
}

// const Separator = styled.div`
//   height: 100%;
//   width: 1px;
//   background: ${color.smokeDark};
//   display: inline-block;
//   margin-left: 10px;
// `;

const Bar = styled(Flex)`
  z-index: 100;
  animation: ${fadeIn} 150ms ease-in-out;
  position: relative;
  align-items: center;
  background: ${color.smoke};
  height: 44px;

  &:before,
  &:after {
    content: '';
    position: absolute;
    left: -100%;
    width: 100%;
    height: 44px;
    background: ${color.smoke};
  }

  &:after {
    left: auto;
    right: -100%;
  }

  @media print {
    display: none;
  }
`;

const HiddenInput = styled.input`
  position: absolute;
  top: -100%;
  left: -100%;
  visibility: hidden;
`;


export default BlockToolbar;
