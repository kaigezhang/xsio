import storage from 'redux-persist/es/storage';

export default {
  key : 'root',
  storage,
  whitelist : ['auth', 'orm']
};
