/* @flow */

import normalize from '../utils/normalize';
import { ACTION_TYPE } from '../constants';

export default function cache(state = {}, action) {
  const { type, payload, error } = action;

  if (error) {
    return state;
  }

  switch (type) {
    case ACTION_TYPE:
      return normalize(state, payload);
    default:
      return state;
  }
}
