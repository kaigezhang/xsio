import { connect } from 'react-redux';

import DocumentMenu from './DocumentMenu';
import {
  starDocument,
  unstarDocument,
  pinDocument,
  unpinDocument,
  downDocument
} from '../../store/actions/documents';

const mapDispatch = dispatch => ({
  starDocument: documentId => starDocument(documentId),
  unstarDocument: documentId => unstarDocument(documentId),
  pinDocument: documentId => pinDocument(documentId),
  unpinDocument: documentId => unpinDocument(documentId),
  downDocument: document => downDocument(document),
});


export default connect(null, mapDispatch)(DocumentMenu);
