import { connect } from 'react-redux';
import { statusSelector } from 'store/selectors/status';
import { documentBySlugSelector } from 'store/selectors/documents';
import { uiSelector } from 'store/selectors/ui';
import { documentEditSelector } from 'store/selectors/edit';

import { clearActiveDocument, setActiveDocument } from 'store/actions/ui';
import { fetchDocument, viewedDocument, updateDocumentData } from 'store/actions/documents';
import { updateData, saveDocument } from 'store/actions/edit';
import DocumentScene from './Document';

const mapState = (state, { match }) => ({
  document: documentBySlugSelector(state, match),
  status: statusSelector(state),
  ui: uiSelector(state),
  documentEdit: documentEditSelector(state),
});

const mapDispatch = dispatch => ({
  clearActiveDocument: () => dispatch(clearActiveDocument()),
  setActiveDocument: document => dispatch(setActiveDocument(document)),

  fetchDocument: documentSlug => dispatch(fetchDocument(documentSlug)),
  viewedDocument: document => dispatch(viewedDocument(document)),
  saveDocument: (document, publish) => dispatch(saveDocument(document, publish)),
  // updateDocumentData: (document, text, dirty) => dispatch(updateDocumentData(document, text, dirty))
  updateDocumentData: (document, text, dirty) => dispatch(updateData(document, text, dirty))
});


export default connect(mapState, mapDispatch)(DocumentScene);
