import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

import { initializeApi, initialHttp } from 'services/api/api';
import persistStore  from 'redux-persist/es/persistStore';
import persistReducer from 'redux-persist/es/persistReducer';
import persistConfig from 'src/persistConfig';
import { intializeTranslationUtils } from 'utils/translations';
import rootReducer from './reducers';
import { rootSaga } from './sagas';


const sagaMiddleware = createSagaMiddleware();

const middlewares = [
  thunk,
  sagaMiddleware
];

const enhancer = compose(
  applyMiddleware(...middlewares),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);


const persistedReducer = persistReducer(persistConfig, rootReducer);

const configureStore = (initialState = {}) => {
  const store = createStore(persistedReducer, initialState, enhancer);
  const persistor = persistStore(store);

  initializeApi(store);
  initialHttp(store);
  intializeTranslationUtils(store);
  sagaMiddleware.run(rootSaga);

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      // eslint-disable-next-line global-require
      const nextReducer = require('./reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return {
    store, persistor
  };
};


export default configureStore;
