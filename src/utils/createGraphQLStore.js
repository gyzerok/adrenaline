/* @flow */

import cache from '../reducers/cache';

function reduceReducers(...reducers) {
  return (previous, current) =>
    reducers.reduce(
      (p, r) => r(p, current),
      previous
    );
}

export default function createGraphQLStore(next) {
  return (reducer, initialState) => {
    const extendedReducer = reduceReducers(
      reducer,
      (state, action) => ({
        ...state,
        cache: cache(state.cache, action),
      }),
    );
    return next(extendedReducer, {
      ...initialState,
      cache: {},
    });
  };
}
