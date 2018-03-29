import  { connect } from 'react-redux';
import { updateLibrary } from 'store/actions/library';
import LibraryEdit from './Edit';

export const mapState = state => ({

});


export const mapDispatch = dispatch => ({
  updateLibrary: library => dispatch(updateLibrary(library)),
});


export default connect(null, mapDispatch)(LibraryEdit);
