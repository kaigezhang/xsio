import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { userSelector } from 'store/selectors/shared/auth';
import { logout } from 'store/actions/auth';

const propsTypes = {
  children: PropTypes.any,
  user: PropTypes.any,
  logout: PropTypes.func,
};


const Auth = ({ children, user, logout }) => {
  if (user && user.id) {
    return children;
  }

  logout();
  return <Redirect to="/login" />;
};

Auth.propTypes = propsTypes;

const mapState = state => ({
  user: userSelector(state)
});

const mapDispatch = dispatch => ({
  logout: () => dispatch(logout())
});


export default connect(mapState, mapDispatch)(Auth);
