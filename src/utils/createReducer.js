/* @flow */

import { ACTION_TYPE } from '../constants';

export default function createReducer() {
  return (state = {}, action) => {
    switch (action.type) {
      case ACTION_TYPE:
        return {
          ...state,
          ...action.payload,
        };
      default:
        return state;
    }
  };
}
