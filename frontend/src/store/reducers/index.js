import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import orm from './orm';
import auth from './auth';
import i18n from './i18n';
import ui from './ui';
import notifications from './notifications';
import errors from './errors';
import status from './status';
import edit from './edit';
import file from './file';

const reducers = {
  form,
  auth,
  i18n,
  ui,
  notifications,
  errors,
  status,
  edit,
  file,
  orm,
};
const rootReducer = combineReducers(reducers);

export default rootReducer;
