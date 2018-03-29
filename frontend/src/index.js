import React from 'react';
import { render } from 'react-dom';

import { PersistGate } from 'redux-persist/es/integration/react';
// import getStoredState from 'redux-persist/es/getStoredState';
// import persistConfig from './persistConfig';

import App from './App';
import configureStore from './store';

// const initialReactReactAndRedux = (initialState) => {
//
// };

// getStoredState(persistConfig).then(initialReactReactAndRedux);
// initialReactReactAndRedux({});

const { store, persistor } = configureStore();

const root = document.getElementById('app');

const renderApp = () => (
  <PersistGate persistor={persistor}>
    <App store={store} />
  </PersistGate>
);

render(renderApp(), root);

if (module.hot) {
  module.hot.accept('./App', () => {
    render(renderApp(), root);
  });
}
