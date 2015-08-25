/* @flow */

import 'whatwg-fetch';
import React from 'react';
import { Provider } from 'react-redux';
import App from './components/App';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createGraphQLStore } from '../../src';

const finalCreateStore = compose(
  applyMiddleware(thunk),
  createGraphQLStore,
  createStore
);

const store = finalCreateStore(x => x);

const rootNode = document.getElementById('root');
React.render(
  <Provider store={store}>
    {() => <App />}
  </Provider>,
  rootNode
);
