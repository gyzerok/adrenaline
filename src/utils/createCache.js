/* @flow */

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import merge from './merge';
import { UPDATE_CACHE, UPDATE_CACHE_BY_ID } from '../constants';

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

    if (type === UPDATE_CACHE) {
      return merge(state, payload[key] || {});
    }

    if (type === UPDATE_CACHE_BY_ID) {
      return state; // TODO: implement it
    }

    return state;
  };
}
