import { connect } from 'react-redux';
import { deleteDocument } from 'store/actions/documents';
import DocumentDelete from './DocumentDelete';

const mapState = state => ({

});

const mapDispatch = dispatch => ({
  deleteDocument: documentId => dispatch(deleteDocument(documentId))
});


export default connect(mapState, mapDispatch)(DocumentDelete);
