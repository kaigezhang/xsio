import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { store, view } from 'react-easy-state';

import { Value, Change } from 'slate';
import { Editor } from 'slate-react';
import styled from 'styled-components';
import breakpoint from 'styled-components-breakpoint';
import keydown from 'react-keydown';
import getDataTransferFiles from 'utils/getDataTransferFiles';

import Flex from 'shared/components/Flex';
import ClickablePadding from './components/ClickablePadding';
import Toolbar from './components/Toolbar';
import BlockInsert from './components/BlockInsert';
import Placeholder from './components/Placeholder';
import Contents from './components/Contents';

import createRenderNode from './nodes';
import Markdown from './serializer';
import createPlugins from './plugins';
import { insertImageFile } from './changes';
import schema from './schema';
import { isModKey } from './utils';
import renderMark from './marks';

const props = {
  text: PropTypes.string,
  emoji: PropTypes.string,
  onImageUploadStart: PropTypes.func,
  onImageUploadStop: PropTypes.func,
  readOnly: PropTypes.boolean,
  onSave: PropTypes.func,
  onCancle: PropTypes.func,
  onChange: PropTypes.onChange,
};

@view
class MarkdownEditor extends Component {
  ui = store({
    editorValue: '',
    editorLoaded: false
  })

  constructor(props) {
    super(props);

    this.renderNode = createRenderNode({ onInsertImage: this.insertImage });

    this.plugins = createPlugins({ onImageUploadStart: props.onImageUploadStart, onImageUploadStop: props.onImageUploadStop });

    this.ui.editorValue = Markdown.deserialize(props.text);
  }

  componentDidMount() {
    if (this.props.readOnly) { return; }
    if (this.props.text) {
      this.focusAtEnd();
    } else {
      this.focusAtStart();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.readOnly && !this.props.readOnly) {
      this.focusAtEnd();
    }
  }
  setEditorRef = (ref) => {
    if (this.props.inputRef) {
      this.props.inputRef(ref);
    }
    this.editor = ref;
    console.log(this.editor, 'this.editor');
    this.ui.editorLoaded = true;
  }

  onChange = (change) => {
    if (this.ui.editorValue !== change.value) {
      this.props.onChange(Markdown.serialize(change.value));
      this.ui.editorValue = change.value;
    }
  }

  handleDrop = async (ev) => {
    if (this.props.readOnly) { return; }

    // check if this event was already handled by the Editor
    if (ev.isDefaultPrevented()) { return; }

    // otherwise we'll handle this
    ev.preventDefault();
    ev.stopPropagation();

    const files = getDataTransferFiles(ev);
    /* eslint-disable */
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        await this.insertImageFile(file);
      }
    }
    /* eslint-enable */
  }
  insertImageFile = (file) => {
    this
      .editor
      .change(change => change.call(insertImageFile, file, this.editor, this.props.onImageUploadStart, this.props.onImageUploadStop));
  }

  cancelEvent = (e) => {
    e.preventDefault();
  }

  // Handling of keyboard shortcuts outside of editor focus
  @keydown('meta+s')
  onSave(ev) {
    if (this.props.readOnly) { return; }

    ev.preventDefault();
    ev.stopPropagation();
    this
      .props
      .onSave({ redirect: false });
  }

  @keydown('meta+enter')
  onSaveAndExit(ev) {
    if (this.props.readOnly) { return; }

    ev.preventDefault();
    ev.stopPropagation();
    this
      .props
      .onSave({ redirect: true });
  }

  @keydown('esc')
  onCancel() {
    if (this.props.readOnly) { return; }
    this
      .props
      .onCancel();
  }

  // Handling of keyboard shortcuts within editor focus
  onKeyDown = (ev, change) => {
    if (!isModKey(ev)) { return; }

    switch (ev.key) {
    case 's':
      this.onSave(ev);
      return change;
    case 'Enter':
      this.onSaveAndExit(ev);
      return change;
    case 'Escape':
      this.onCancel();
      return change;
    default:
      return null;
    }
  }

  focusAtStart = () => {
    this
      .editor
      .change((change) => {
        change
          .collapseToStartOf(change.value.document)
          .focus();
      });
  }

  focusAtEnd = () => {
    this
      .editor
      .change(change => change.collapseToEndOf(change.value.document).focus());
  }

  getChildContext() {
    const { parent } = this;
    return {
      parent
    };
  }

  render() {
    const { readOnly, emoji, onSave } = this.props;
    /*  Toolbar 缺少搜索document的props */
    return (
      <Flex
        innerRef={div => this.parent = div}
        onDrop={this.handleDrop}
        onDragOver={this.cancelEvent}
        onDragEnter={this.cancelEvent}
        align="flex-start"
        justify="center"
        auto>
        <MaxWidth column auto>
          <Header onClick={this.focusAtStart} readOnly={readOnly} />
          {readOnly && this.ui.editorLoaded && this.editor && <Contents editor={this.editor} />}
          {!readOnly && this.editor && (<Toolbar value={this.ui.editorValue} editor={this.editor} />)}

          {!readOnly && this.editor && (<BlockInsert editor={this.editor} onInsertImage={this.insertImageFile} />)}

          <StyledEditor
            innerRef={this.setEditorRef}
            placeholder="Start with a title…"
            bodyPlaceholder="…the rest is your canvas"
            plugins={this.plugins}
            emoji={emoji}
            value={this.ui.editorValue}
            renderNode={this.renderNode}
            renderMark={renderMark}
            schema={schema}
            onKeyDown={this.onKeyDown}
            onChange={this.onChange}
            onSave={onSave}
            readOnly={readOnly}
            spellCheck={!readOnly} />
          <ClickablePadding
            onClick={!readOnly
              ? this.focusAtEnd
              : undefined}
            grow />
        </MaxWidth>
      </Flex>
    );
  }
}

const MaxWidth = styled(Flex)`
  padding: 0 20px;
  max-width: 100vw;
  //max-width: 100%;
  height: 100%;

  ${breakpoint('tablet')`
    padding: 0;
    margin: 0 60px;
    max-width: 46em;
  `};
`;

const Header = styled(Flex)`
  height: 60px;
  flex-shrink: 0;
  align-items: flex-end;
  ${({ readOnly }) => !readOnly && 'cursor: text;'};

  @media print {
    display: none;
  }
`;

const StyledEditor = styled(Editor)`
  font-weight: 400;
  font-size: 1em;
  line-height: 1.7em;
  width: 100%;
  color: #1b2830;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 500;
  }

  h1:first-of-type {
    ${Placeholder} {
      visibility: visible;
    }
  }

  p:nth-child(2) {
    ${Placeholder} {
      visibility: visible;
    }
  }

  ul,
  ol {
    margin: 1em 0.1em;
    padding-left: 1em;

    ul,
    ol {
      margin: 0.1em;
    }
  }

  p {
    position: relative;
    margin-top: 1.2em;
    margin-bottom: 1.2em;
  }

  a:hover {
    text-decoration: ${({ readOnly }) => (readOnly ? 'underline' : 'none')};
  }

  li p {
    display: inline;
    margin: 0;
  }

  .todoList {
    list-style: none;
    padding-left: 0;

    .todoList {
      padding-left: 1em;
    }
  }

  .todo {
    span:last-child:focus {
      outline: none;
    }
  }

  blockquote {
    border-left: 3px solid #efefef;
    margin: 1.2em 0;
    padding-left: 10px;
    font-style: italic;
  }

  table {
    border-collapse: collapse;
  }

  tr {
    border-bottom: 1px solid #eee;
  }

  th {
    font-weight: bold;
  }

  th,
  td {
    padding: 5px 20px 5px 0;
  }

  b,
  strong {
    font-weight: 600;
  }
`;


MarkdownEditor.childContextTypes = {
  parent: PropTypes.any,
};
export default MarkdownEditor;
