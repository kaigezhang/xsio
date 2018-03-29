// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BaseModal from 'components/Modal';
import CollectionNew from 'scenes/CollectionNew';
import CollectionEdit from 'scenes/CollectionEdit';
import CollectionDelete from 'scenes/CollectionDelete';
import DocumentDelete from 'scenes/DocumentDelete';
import KeyboardShortcuts from 'scenes/KeyboardShortcuts';

import LibraryNew from 'scenes/Library/modals/New';
import LibraryEdit from 'scenes/Library/modals/Edit';
import LibraryDelete from 'scenes/Library/modals/Delete';

const propTypes = {
  clearActiveModal: PropTypes.func,
  activeModalName: PropTypes.func,
  activeModalProps: PropTypes.func
};

class Modals extends Component {
  handleClose = () => {
    this.props.clearActiveModal();
  };

  render() {
    const { activeModalName, activeModalProps } = this.props.ui;
    const Modal = ({
      name,
      children,
      ...rest
    }) => (
      <BaseModal
        ariaHideApp={false}
        isOpen={activeModalName === name}
        onRequestClose={this.handleClose}
        {...rest}>
        {React.cloneElement(children, activeModalProps)}
      </BaseModal>
    );


    return (
      <span>
        <Modal name="collection-new" title="创建新的collection">
          <CollectionNew onSubmit={this.handleClose} />
        </Modal>
        <Modal name="collection-edit" title="修改collection">
          <CollectionEdit onSubmit={this.handleClose} />
        </Modal>
        <Modal name="collection-delete" title="删除collection">
          <CollectionDelete onSubmit={this.handleClose} />
        </Modal>
        <Modal name="document-delete" title="删除document">
          <DocumentDelete onSubmit={this.handleClose} />
        </Modal>
        <Modal name="keyboard-shortcuts" title="快捷键">
          <KeyboardShortcuts />
        </Modal>
        <Modal name="library-new" title="创建新的Library">
          <LibraryNew onSubmit={this.handleClose}  />
        </Modal>
        <Modal name="library-edit" title="修改Library">
          <LibraryEdit onSubmit={this.handleClose}  />
        </Modal>
        <Modal name="library-delete" title="删除Library">
          <LibraryDelete onSubmit={this.handleClose}  />
        </Modal>
      </span>
    );
  }
}

export default Modals;
