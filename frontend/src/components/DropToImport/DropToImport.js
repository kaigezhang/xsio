// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectGlobal } from 'styled-components';
import { color } from 'shared/styles/constants';
import importFile from 'utils/importFile';
import invariant from 'invariant';
import omit from 'lodash/omit';
import Dropzone from 'react-dropzone';
import LoadingIndicator from 'components/LoadingIndicator';


const props = {
  children: PropTypes.node,
  collectionId: PropTypes.string,
  documentId: PropTypes.string,
  activeClassName: PropTypes.string,
  rejectClassName: PropTypes.string,
  documents: PropTypes.object,
  disabled: PropTypes.bool,
  history: PropTypes.object,
};

// eslint-disable-next-line
injectGlobal`
  .activeDropZone {
    background: ${color.slateDark};
    svg { fill: ${color.white}; }
  }

  .activeDropZone a {
    color: ${color.white} !important;
  }
`;


class DropToImport extends Component {
  state = {
    isImporting: false
  }
  onDropAccepted = async (files = []) => {
    this.setState({
      isImporting: true
    });

    try {
      let collectionId = this.props.collectionId;
      const documentId = this.props.documentId;
      const redirect = files.length === 1;

      if (documentId && !collectionId) {
        const document = await this.props.documents.fetch(documentId);
        invariant(document, 'Document not available');
        collectionId = document.collection.id;
      }
      /* eslint-disable */
      for (const file of files) {
        const doc = await importFile({
          documents: this.props.documents,
          file,
          documentId,
          collectionId,
        });

        if (redirect) {
          this.props.history.push(doc.url);
        }
      }
      /* eslint-enable */
    } catch (err) {
      // TODO: show error alert.
    } finally {
      this.setState({
        isImporting: false
      });
    }
  };

  render() {
    const props = omit(
      this.props,
      'history',
      'documentId',
      'collectionId',
      'documents',
      'disabled',
      'menuOpen'
    );

    if (this.props.disabled) return this.props.children;

    return (
      <Dropzone
        accept="text/markdown, text/plain"
        onDropAccepted={this.onDropAccepted}
        style={{}}
        disableClick
        disablePreview
        multiple
        {...props}
      >
        {this.state.isImporting && <LoadingIndicator />}
        {this.props.children}
      </Dropzone>
    );
  }
}

export default DropToImport;
