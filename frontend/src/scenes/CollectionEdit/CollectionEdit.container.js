import  { connect } from 'react-redux';
import { updateCollection } from 'store/actions/collections'
import CollectionEdit from './CollectionEdit';

export const mapState = state => ({

});


export const mapDispatch = dispatch => ({
  updateCollection: collection => dispatch(updateCollection(collection)),
});


export default connect(null, mapDispatch)(CollectionEdit);
