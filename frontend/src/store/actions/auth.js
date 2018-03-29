import {
  AUTH_LOGOUT,
  AUTH_LOGIN_SUCCEEDED,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_FAILURE,
  AUTH_LOGIN_SUCCESS,
  CLEAR_AUTH_ERROR,
  AUTH_REGISTER_REQUEST
} from 'store/constants/auth';
import {
  login, register
} from 'services/api/api';
import { apiFetched } from './api';

export const logout = () => ({
  type: AUTH_LOGOUT
});

export const loginUser = formData => (dispatch) => {
  dispatch(loginUserRequest());

  const { email, password } = formData;
  const data = {
    email: email.toLowerCase(),
    password
  };

  return login(data)
    .then((payload) => {
      dispatch(loginUserSuccess(payload));
      return Promise.resolve();
    })
    .catch((apiErrors) => {
      console.log(apiErrors, 'apiErrors');
      try {
        const error = apiErrors[0];
        if (!error) throw apiErrors;
        if (error.detail) {
          dispatch(loginUserFailure({ ...error }));
        }
      } catch (error) {
        dispatch(loginUserFailure());
      }
    });
};

export const registerUser = formData => (dispatch) => {
  dispatch(registerUserRequest());

  const { username, email, password } = formData;
  const data = {
    username,
    email: email.toLowerCase(),
    password
  };

  return register(data)
    .then((payload) => {
      dispatch(loginUserSuccess(payload));
      return Promise.resolve();
    })
    .catch((apiErrors) => {
      console.log(apiErrors, 'apiErrors');
      try {
        const error = apiErrors[0];
        if (!error) throw apiErrors;
        if (error.detail) {
          dispatch(loginUserFailure({ ...error }));
        }
      } catch (error) {
        dispatch(loginUserFailure());
      }
    });
};


export const loginUserRequest = ()  => ({
  type: AUTH_LOGIN_REQUEST
});
export const registerUserRequest = ()  => ({
  type: AUTH_REGISTER_REQUEST
});
export const loginUserSuccess = payload => (dispatch) => {
  dispatch(apiFetched(payload));
  dispatch(loginUserSucceeded(payload));
  dispatch({ type: AUTH_LOGIN_SUCCESS });
};

export const loginUserSucceeded = payload => ({
  type: AUTH_LOGIN_SUCCEEDED,
  payload
});
export const loginUserFailure = (payload = null) => ({
  type: AUTH_LOGIN_FAILURE,
  payload
});

export const logoutUser = () => ({
  type: AUTH_LOGOUT
});

export const clearError = () => ({
  type: CLEAR_AUTH_ERROR
})
