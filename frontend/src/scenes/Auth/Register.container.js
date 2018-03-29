import { connect } from 'react-redux';

import { registerUser, clearError, logoutUser } from 'store/actions/auth';
import { authSelector } from 'store/selectors/shared/auth';

import Registration from './Register';

const mapState = state => ({ auth: authSelector(state) });

const mapDispatch = dispatch => ({
  registerUser: formData => dispatch(registerUser(formData)),
  logout: () => dispatch(logoutUser()),
  clearError: () => dispatch(clearError())
});

export default connect(mapState, mapDispatch)(Registration);
