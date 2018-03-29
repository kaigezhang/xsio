import { connect } from 'react-redux';
import { setActiveModal } from 'store/actions/ui';
import { logout } from 'store/actions/auth';
import AccountMenu from './AccountMenu';

const mapDispatch = dispatch => ({
  setActiveModal: (name, props) => dispatch(setActiveModal(name, props)),
  logout: () => dispatch(logout())
});


export default connect(null, mapDispatch)(AccountMenu);
