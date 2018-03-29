import  { connect } from 'react-redux';
import { fetchRecentlyEdited, fetchPinnedDocuments } from 'store/actions/collections';
import { setActiveCollection, clearActiveCollection } from 'store/actions/ui';
import { collectionByIdSelector, recentlyEditDocumentsSelector, pinnedDocumentsSelector }  from 'store/selectors/collections';
import Collection from './Collection';

const mapState = (state, { match }) => ({
  collection: collectionByIdSelector(state, match),
  recentlyEditedDocuments: recentlyEditDocumentsSelector(state, match),
  pinnedDocuments: pinnedDocumentsSelector(state, match)
});


const mapDispatch = dispatch => ({
  setActiveCollection: collection => dispatch(setActiveCollection(collection)),
  clearActiveCollection: () => dispatch(clearActiveCollection()),
  // getRecentlyEdited: ({ limit, collection }) => dispatch(fetchRecentlyEdited(limit, collection)),
  // getPinnedDocuments: collection => dispatch(fetchPinnedDocuments(collection)),
});


export default connect(mapState, mapDispatch)(Collection);
