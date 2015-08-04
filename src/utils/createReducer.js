/* @flow */

import { mapObj, reduce } from 'ramda';
import mergeDeep from 'deepmerge';
import { ACTION_TYPE } from '../constants';

export default function createReducer() {
  return (state = {}, action) => {
    const { type, payload } = action;

    const keyedPayload = mapObj(value => {
      return reduce((acc, v) => {
        return {
          ...acc,
          [v._id]: v,
        };
      }, {}, value);
    }, payload);

    switch (type) {
      case ACTION_TYPE:
        return mergeDeep(state, keyedPayload);
      default:
        return state;
    }
  };
}
