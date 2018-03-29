import { connect } from 'react-redux';
import { setActiveModal } from 'store/actions/ui';
import LibraryMenu from './LibraryMenu';

const mapDispatch = dispatch => ({
  setActiveModal: (name, props) => dispatch(setActiveModal(name, props)),
});


export default connect(null, mapDispatch)(LibraryMenu);
