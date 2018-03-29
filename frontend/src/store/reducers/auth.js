import {
  AUTH_LOGOUT,
  AUTH_LOGIN_SUCCEEDED,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_FAILURE,
  AUTH_LOGIN_SUCCESS,
  CLEAR_AUTH_ERROR
} from 'store/constants/auth';

const initialState = {
  user: null,
  isAuthenticating: false,
  isAuthenticated: false,
  error: null,
};


const authReducer = (state = initialState, action) => {
  switch (action.type) {
  case AUTH_LOGIN_REQUEST:
    return {
      ...state,
      isAuthenticating: true,
      isAuthenticated: false,
      error: null,
    };
  case AUTH_LOGIN_SUCCEEDED:
    return {
      ...state,
      user: Object.keys(action.payload.users)[0],
      isAuthenticating: false,
      isAuthenticated: true,
      error: null,
    };
  case AUTH_LOGIN_FAILURE:
    return {
      ...state,
      isAuthenticating: false,
      isAuthenticated: false,
      error: action.payload,
    };
  case AUTH_LOGOUT:
    return {
      ...state,
      ...initialState
    };
  case CLEAR_AUTH_ERROR:
    return {
      ...state,
      error: null,
    };
  default:
    return state;
  }
};


export default authReducer;
