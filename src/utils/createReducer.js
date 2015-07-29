/* @flow */

import merge from 'deepmerge';
import { ACTION_TYPE } from '../constants';

export default function createReducer() {
  return (state = {}, action) => {
    switch (action.type) {
      case ACTION_TYPE:
        return merge(state, action.payload);
      default:
        return state;
    }
  };
}
