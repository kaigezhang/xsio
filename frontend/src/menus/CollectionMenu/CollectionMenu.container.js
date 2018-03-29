import { connect } from 'react-redux';
import { setActiveModal } from 'store/actions/ui';
import CollectionMenu from './CollectionMenu';

const mapDispatch = dispatch => ({
  setActiveModal: (name, props) => dispatch(setActiveModal(name, props)),
});


export default connect(null, mapDispatch)(CollectionMenu);
