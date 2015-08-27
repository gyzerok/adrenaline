/* @flow */

import normalize from '../utils/normalize';
import { ACTION_TYPE } from '../constants';

export default function graphql(state = {}, action, deserialize = normalize) {
  const { type, payload, error } = action;

  if (error) {
    return state;
  }

  switch (type) {
    case ACTION_TYPE:
      return deserialize(state, payload);
    default:
      return state;
  }
}
