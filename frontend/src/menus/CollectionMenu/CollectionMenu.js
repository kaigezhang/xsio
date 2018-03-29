// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import getDataTransferFiles from 'utils/getDataTransferFiles';
import importFile from 'utils/importFile';
import MoreIcon from 'components/Icon/MoreIcon';
import { DropdownMenu, DropdownMenuItem } from 'components/DropdownMenu';


const propTypes = {
  label: PropTypes.node,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  history: PropTypes.object,
  setActiveModal: PropTypes.func,
  document: PropTypes.object,
  documents: PropTypes.object,
  collection: PropTypes.object,
};


class CollectionMenu extends Component {
  onNewDocument = (ev) => {
    ev.preventDefault();
    const { collection, history } = this.props;
    history.push(`/collections/${collection.id}/new`);
  };

  onImportDocument = (ev) => {
    ev.preventDefault();

    // simulate a click on the file upload input element
    this.file.click();
  };

  onFilePicked = async (ev) => {
    const files = getDataTransferFiles(ev);
    const document = await importFile({
      file: files[0],
      documents: this.props.documents,
      collectionId: this.props.collection.id,
    });

    this.props.history.push(document.url);
  };

  onEdit = (ev) => {
    ev.preventDefault();
    const { collection } = this.props;
    this.props.setActiveModal('collection-edit', { collection });
  };

  onDelete = (ev) => {
    ev.preventDefault();
    const { collection } = this.props;
    this.props.setActiveModal('collection-delete', { collection });
  };

  render() {
    const { collection, label, onOpen, onClose } = this.props;

    return (
      <span>
        <HiddenInput
          type="file"
          innerRef={ref => (this.file = ref)}
          onChange={this.onFilePicked}
          accept="text/markdown, text/plain"
        />
        <DropdownMenu
          label={label || <MoreIcon />}
          onOpen={onOpen}
          onClose={onClose}
        >
          {collection && (
            <React.Fragment>
              <DropdownMenuItem onClick={this.onNewDocument}>
                New document
              </DropdownMenuItem>
              <DropdownMenuItem onClick={this.onImportDocument}>
                Import document
              </DropdownMenuItem>
              <hr />
              <DropdownMenuItem onClick={this.onEdit}>Edit…</DropdownMenuItem>
            </React.Fragment>
          )}
          <DropdownMenuItem onClick={this.onDelete}>Delete…</DropdownMenuItem>
        </DropdownMenu>
      </span>
    );
  }
}

const HiddenInput = styled.input`
  position: absolute;
  top: -100px;
  left: -100px;
  visibility: hidden;
`;

export default CollectionMenu;
