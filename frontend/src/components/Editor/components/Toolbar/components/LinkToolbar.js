import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

// import ArrowKeyNavigation from 'boundless-arrow-key-navigation';
import { store, view } from 'react-easy-state';

// import keydown from 'react-keydown';
import CloseIcon from 'components/Icon/CloseIcon';
import OpenIcon from 'components/Icon/OpenIcon';
import TrashIcon from 'components/Icon/TrashIcon';
import Flex from 'shared/components/Flex';

import ToolbarButton from './ToolbarButton';
// import DocumentResult from './DocumentResult';


const propTypes = {
  editor: PropTypes.object,
  link: PropTypes.node,
  documents: PropTypes.object,
  onBlur: PropTypes.func,
};

class LinkToolbar extends Component {
  ui = store({
    isEditing: false,
    isFetching: false,
    resultIds: [],
    searchTerm: ''
  })

  componentDidMount() {
    this.getEditing();
  }

  getEditing = () => {
    const isEditing = !!this.props.link.data.get('href');
    this.ui.isEditing = isEditing;
    setImmediate(() =>
      window.addEventListener('click', this.handleOutsideMouseClick)
    );
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleOutsideMouseClick);
  }

  handleOutsideMouseClick = (ev) => {
    const element = findDOMNode(this.wrapper); //eslint-disable-line

    if (
      !element ||
      (ev.target instanceof HTMLElement && element.contains(ev.target)) ||
      (ev.button && ev.button !== 0)
    ) {
      return null;
    }

    this.close();
  }

  close = () => {
    if (this.input.value) {
      this.props.onBlur();
    } else {
      this.removeLink();
    }
  }

  search = async () => {
    this.ui.isFetching = true;

    const { searchTerm } = this.ui;

    if (searchTerm) {
      let resultIds = [];
      try {
        resultIds = await this.props.documentSearch(searchTerm);
      } catch (err) {
        resultIds = [];
      }
      this.ui.resultIds = resultIds;
      this.isFetching = false;
    }
  }

  selectDocument = (ev, document) => {
    ev.preventDefault();
    this.save(document.id);
  }

  onKeyDown = (ev) => {
    switch (ev.keyCode) {
    case 13: // enter
      ev.preventDefault();
      return this.save(ev.target.value);
    case 27: // escape
      return this.close();
    case 40: // down
      ev.preventDefault();
      if (this.firstDocument) {
          const element = findDOMNode(this.firstDocument); //eslint-disable-line
        if (element instanceof HTMLElement) element.focus();
      }
      break;
    default:
    }
  }

  onChange = (ev) => {
    try {
      new URL(ev.target.value); //eslint-disable-line
    } catch (err) {
      // this is not a valid url, show search suggestions
      // this.ui.searchTerm = ev.target.value;
      // this.search();
      return;
    }
    this.ui.resultIds = [];
  }

  removeLink = () => {
    this.save('');
  }

  openLink = () => {
    const href = this.props.link.data.get('href');
    window.open(href, '__blank');
  }

  save = (href) => {
    const { editor, link, onBlur } = this.props;
    href = href.trim();

    editor.change((change) => {
      if (href) {
        change.setInline({ type: 'link', data: { href } });
      } else if (link) {
        const startBlock = change.value.startBlock;
        const selContainsLink = !!(startBlock && startBlock.getChild(link.key));
        if (selContainsLink) change.unwrapInlineByKey(link.key);
      }

      change.deselect();
      onBlur();
    });
  }

  setFirstDocumentRef = (ref) => {
    this.firstDocument = ref;
  }

  render() {
    const href = this.props.link.data.get('href');
    const { isEditing } = this.ui;
    // const hasResults = resultIds.length > 0;

    return (
      <span ref={ref => (this.wrapper = ref)}>
        <LinkEditor>
          <Input
            innerRef={ref => (this.input = ref)}
            defaultValue={href}
            placeholder="添加一个链接..."
            onKeyDown={this.onKeyDown}
            onChange={this.onChange}
            autoFocus={href === ''}
          />
          {isEditing && (
            <ToolbarButton onMouseDown={this.openLink}>
              <OpenIcon light />
            </ToolbarButton>
          )}

          <ToolbarButton onMouseDown={this.removeLink}>
            { isEditing ? <TrashIcon light /> : <CloseIcon light  />}
          </ToolbarButton>
        </LinkEditor>
        {/* {
          hasResults && (
            <SearchResults>
              <ArrowKeyNavigation
                mode={ArrowKeyNavigation.mode.VERTICAL}
                defaultActiveChildIndex={0}
              >
                {
                  resultIds.map((id, index) => {
                    const document = this.props.getDocumentById(id);
                    if (!document) return null;

                    return (
                      <DocumentResult
                        innerRef={ref => index === 0 && this.setFirstDocumentRef(ref)}
                        document={document}
                        key={document.id}
                        onClick={e => this.selectDocument(e, document)}
                      />
                    );
                  })
                }
              </ArrowKeyNavigation>
            </SearchResults>
          )
        } */}

      </span>
    );
  }
}


const SearchResults = styled.div`
  background: #2f3336;
  position: absolute;
  top: 100%;
  width: 100%;
  height: auto;
  left: 0;
  padding: 8px;
  margin-top: -3px;
  margin-bottom: 0;
  border-radius: 0 0 4px 4px;
`;

const LinkEditor = styled(Flex)`
  margin-left: -8px;
  margin-right: -8px;
`;

const Input = styled.input`
  font-size: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  padding: 4px 8px;
  border: 0;
  margin: 0;
  outline: none;
  color: #fff;
  flex-grow: 1;
`;

export default withRouter(view(LinkToolbar));
