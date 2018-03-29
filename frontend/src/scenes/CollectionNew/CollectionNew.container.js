import  { connect } from 'react-redux';
import { createCollection } from 'store/actions/collections';
import { clearActiveModal } from 'store/actions/ui';
import CollectionNew from './CollectionNew';

export const mapState = state => ({

});


export const mapDispatch = dispatch => ({
  createCollection: collection => dispatch(createCollection(collection)),
  clearActiveModal: () => dispatch(clearActiveModal())
});


export default connect(null, mapDispatch)(CollectionNew);
