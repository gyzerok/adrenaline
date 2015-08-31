/* @flow */

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import merge from './merge';
import { ACTION_TYPE } from '../constants';

const composedStore = compose(
  applyMiddleware(thunk),
  createStore
);

export default function createCache(parsedSchema) {
  const reducer = combineReducers(
    Object.keys(parsedSchema).reduce((acc, key) => {
      return {
        ...acc,
        [key]: createReducer(key),
      };
    }, {})
  );
  return composedStore(reducer);
}

function createReducer(key) {
  return (state = {}, action) => {
    const { type, payload, error } = action;

    if (error) {
      return state;
    }

    switch (type) {
      case ACTION_TYPE:
        return merge(state, payload[key] || {});
      default:
        return state;
    }
  };
}
