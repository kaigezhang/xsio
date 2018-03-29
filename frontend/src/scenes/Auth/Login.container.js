import { connect } from 'react-redux';

import { loginUser, clearError, logoutUser } from 'store/actions/auth';
import { authSelector } from 'store/selectors/shared/auth';

import Login from './Login';

const mapState = state => ({ auth: authSelector(state) });

const mapDispatch = dispatch => ({
  loginUser: formData => dispatch(loginUser(formData)),
  logout: () => dispatch(logoutUser()),
  clearError: () => dispatch(clearError())
});

export default connect(mapState, mapDispatch)(Login);
