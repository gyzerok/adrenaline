/* @flow */

import { createStore, applyMiddleware, combineReducers } from 'redux';
import merge from './merge';
import { UPDATE_CACHE, UPDATE_CACHE_BY_ID } from '../constants';

export default function createCache(parsedSchema, middlewares = []) {
  const composedStore = (
    !middlewares.length ? createStore :
    applyMiddleware(...middlewares)(createStore)
  );
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
