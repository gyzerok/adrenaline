/* @flow */

import graphql from '../reducers/graphql';

function reduceReducers(...reducers) {
  return (previous, current) =>
    reducers.reduce(
      (p, r) => r(p, current),
      previous
    );
}

export default function createGraphQLStore() {
  return next => (reducer, initialState) => {
    const extendedReducer = reduceReducers(
      reducer,
      (state, action) => ({ ...state, graphql: graphql(state.graphql, action) }),
    );
    return next(extendedReducer, initialState);
  };
}
