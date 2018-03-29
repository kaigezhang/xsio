import React, { PureComponent } from 'react';
import styled from 'styled-components';

import BoldIcon from 'components/Icon/BoldIcon';
import CodeIcon from 'components/Icon/CodeIcon';
import Heading1Icon from 'components/Icon/Heading1Icon';
import Heading2Icon from 'components/Icon/Heading2Icon';
import ItalicIcon from 'components/Icon/ItalicIcon';
import BlockQuoteIcon from 'components/Icon/BlockQuoteIcon';
import LinkIcon from 'components/Icon/LinkIcon';
import StrikethroughIcon from 'components/Icon/StrikethroughIcon';

class FormattingToolbar extends PureComponent {
  onClickBlock = (ev, type) => {
    ev.preventDefault();
    this.props.editor.change(change => change.setBlock(type));
  }

  onClickMark = (ev, type) => {
    ev.preventDefault();
    this.props.editor.change(change => change.toggleMark(type));
  }

  isBlock = (type) => {
    const { startBlock } = this.props.editor.value;
    return startBlock && startBlock.type === type;
  }
  hasMark = type => this.props.editor.value.marks.some(mark => mark.type === type)


  handleCreateLink = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();

    const data = { href: '' };
    this.props.editor.change((change) => {
      change.wrapInline({ type: 'link', data });
      this.props.onCreateLink(ev);
    });
  }
  renderMarkButton = (type, IconClass) => {
    const isActive = this.hasMark(type);
    const onMouseDown = ev => this.onClickMark(ev, type);

    return (
      <ToolbarButton onMouseDown={onMouseDown} active={isActive}>
        <IconClass light />
      </ToolbarButton>
    );
  }
  renderBlockButton = (type, IconClass) => {
    const isActive = this.isBlock(type);
    const onMouseDown = ev => this.onClickBlock(ev, isActive ? 'paragraph' : type);

    return (
      <ToolbarButton onMouseDown={onMouseDown} active={isActive}>
        <IconClass light />
      </ToolbarButton>
    );
  }

  /* render() {
    return (
      <span>
        <ToolbarButton onMouseDown={ev => this.onClickMark(ev, 'bold')} active={() => this.hasMark('bold')}>
          <BoldIcon light />
        </ToolbarButton>
        <ToolbarButton onMouseDown={ev => this.onClickMark(ev, 'italic')} active={() => this.hasMark('italic')}>
          <ItalicIcon light />
        </ToolbarButton>
        <ToolbarButton onMouseDown={ev => this.onClickMark(ev, 'deleted')} active={() => this.hasMark('deleted')}>
          <StrikethroughIcon light />
        </ToolbarButton>
        <ToolbarButton onMouseDown={ev => this.onClickMark(ev, 'code')} active={() => this.hasMark('code')}>
          <CodeIcon light />
        </ToolbarButton>
        <Separator />
        <ToolbarButton onMouseDown={ev => this.onClickBlock(ev, this.isBlock('heading1') ? 'paragraph' : 'heading1')} active={() => this.isBlock('heading1')}>
          <Heading2Icon light />
        </ToolbarButton>
        <ToolbarButton onMouseDown={ev => this.onClickBlock(ev, this.isBlock('heading2') ? 'paragraph' : 'heading2')} active={() => this.isBlock('heading2')}>
          <Heading2Icon light />
        </ToolbarButton>
        <ToolbarButton onMouseDown={ev => this.onClickBlock(ev, this.isBlock('block-quote') ? 'paragraph' : 'block-quote')} active={() => this.isBlock('block-quote')}>
          <Heading2Icon light />
        </ToolbarButton>
        <Separator />
        <ToolbarButton onMouseDown={this.handleCreateLink}>
          <LinkIcon light />
        </ToolbarButton>
      </span>
    );
  } */
  render() {
    return (
      <span>
        {this.renderMarkButton('bold', BoldIcon)}
        {this.renderMarkButton('italic', ItalicIcon)}
        {this.renderMarkButton('deleted', StrikethroughIcon)}
        {this.renderMarkButton('code', CodeIcon)}
        <div style={{
          height: '100%',
          width: '1px',
          background: '#fff',
          opacity: 0.2,
          display: 'inline-block',
          marginLeft: '10px'
        }} />
        {this.renderBlockButton('heading1', Heading1Icon)}
        {this.renderBlockButton('heading2', Heading2Icon)}
        {this.renderBlockButton('block-quote', BlockQuoteIcon)}
        <div style={{
          height: '100%',
          width: '1px',
          background: '#fff',
          opacity: 0.2,
          display: 'inline-block',
          marginLeft: '10px'
        }} />
        <ToolbarButton onMouseDown={this.handleCreateLink}>
          <LinkIcon light />
        </ToolbarButton>
      </span>
    );
  }
}

FormattingToolbar.propTypes = {};

/* const Sep = styled.span`
  height: 100%;
  width: 1px;
  background: #fff;
  opacity: 0.2;
  display: inline-block;
  margin-left: 10px;
`; */

const ToolbarButton = styled.button`
  display: inline-block;
  flex: 0;
  width: 24px;
  height: 24px;
  cursor: pointer;
  margin-left: 10px;
  border: none;
  background: none;
  transition: opacity 100ms ease-in-out;
  padding: 0;
  opacity: 0.7;

  &:first-child {
    margin-left: 0;
  }

  &:hover {
    opacity: 1;
  }

  ${({ active }) => active && 'opacity: 1;'};
`;

export default FormattingToolbar;
