/* @flow */

import 'whatwg-fetch';
import React from 'react';
import { Provider } from 'react-redux';
import App from './components/App';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createGraphQLStore } from '../../src';
import { compose, identity } from 'ramda';

const finalCreateStore = compose(
  applyMiddleware(thunk),
  createGraphQLStore,
  createStore
);

const store = finalCreateStore(identity);

const rootNode = document.getElementById('root');
React.render(
  <Provider store={store}>
    {() => <App />}
  </Provider>,
  rootNode
);
