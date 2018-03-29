import React from 'react';
import { connect } from 'react-redux';
import { starDocument, unstarDocument } from 'store/actions/documents';
import { documentRefSelector } from 'store/selectors/documents';
import DocumentPreview from './DocumentPreview';

// const mapState = (state, props) => ({
//   documentRef: documentRefSelector(state, props),
// });

const mapState = (state, props) => {
  const documentRef = documentRefSelector(state, props);

  return {
    documentRef
  };
};

const mapDispatch = dispatch => ({
  starDocument: documentId => dispatch(starDocument(documentId)),
  unstarDocument: documentId => dispatch(unstarDocument(documentId)),
});

export default connect(mapState, mapDispatch)(DocumentPreview);
