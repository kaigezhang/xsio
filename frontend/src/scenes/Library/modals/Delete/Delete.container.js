import  { connect } from 'react-redux';
import { deleteLibrary } from 'store/actions/library';
import LibraryDelete from './Delete';

export const mapState = state => ({

});


export const mapDispatch = dispatch => ({
  deleteLibrary: library => dispatch(deleteLibrary(library)),
});


export default connect(null, mapDispatch)(LibraryDelete);
