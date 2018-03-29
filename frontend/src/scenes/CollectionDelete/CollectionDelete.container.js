import  { connect } from 'react-redux';
import { deleteCollection } from 'store/actions/collections'
import CollectionDelete from './CollectionDelete';

export const mapState = state => ({

});


export const mapDispatch = dispatch => ({
  deleteCollection: collection => dispatch(deleteCollection(collection)),
});


export default connect(null, mapDispatch)(CollectionDelete);
