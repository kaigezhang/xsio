import { reducer } from 'redux-form';

import {
  AUTH_LOGIN_FAILURE,
  AUTH_LOGIN_SUCCESS
} from '../constants/auth';


export default reducer.plugin({
  login: (state, action) => {
    switch (action.type) {
    case AUTH_LOGIN_FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        error: null

      };
    default:
      return state || {};
    }
  }
});
