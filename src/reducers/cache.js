/* @flow */

import merge from '../utils/merge';
import { ACTION_TYPE } from '../constants';

export default function cache(state = {}, action) {
  const { type, payload, error } = action;

  if (error) {
    return state;
  }

  switch (type) {
    case ACTION_TYPE:
      return merge(state, payload);
    default:
      return state;
  }
}
