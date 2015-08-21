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


const introspection = `
  query IntrospectionQueryTypeQuery {
    __schema {
      types {
        name,
        description
      }
      queryType {
        fields {
          name,
          type {
            name,
            kind,
            ofType {
              name,
              kind
            }
          }
        }
      }
    }
  }
`;

fetch('/graphql', {
  method: 'post',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: introspection }),
}).then(res => res.json()).then(json => console.log(json));
