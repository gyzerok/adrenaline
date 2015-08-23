/* @flow */

import { mapValues, reduce } from 'lodash';
import mergeDeep from 'deepmerge';
import { ACTION_TYPE } from '../constants';

export function serialize(payload) {
  return mapValues(payload, value => {
    return reduce(value, (acc, v) => {
      return {
      ...acc,
      [v._id]: v,
      };
    }, {});
  });
}

export function deserialize(state) {
  return mapValues(state, value => {
    return Object.keys(value).map(key => value[key]);
  });
}

export default function graphql(state = {}, action, normalize = serialize) {
  const { type, payload, error } = action;

  if (error) {
    return state;
  }

  switch (type) {
    case ACTION_TYPE:
      return mergeDeep(state, normalize(payload));
    default:
      return state;
  }
}
