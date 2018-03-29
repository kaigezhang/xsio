import  { connect } from 'react-redux';
import { createLibrary } from 'store/actions/library';
import { clearActiveModal } from 'store/actions/ui';
import LibraryNew from './New';

export const mapState = state => ({

});


export const mapDispatch = dispatch => ({
  createLibrary: library => dispatch(createLibrary(library)),
  clearActiveModal: () => dispatch(clearActiveModal())
});


export default connect(null, mapDispatch)(LibraryNew);
