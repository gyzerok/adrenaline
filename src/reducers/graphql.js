/* @flow */

import { map, reduce } from 'lodash';
import mergeDeep from 'deepmerge';
import { ACTION_TYPE } from '../constants';

export default function deserialize(initial, data = {}) {
  return reduce(data, (acc, node) => {
    const { edges, ...stuff } = node;

    if (!edges) {
      return node;
    }

    const normalizedNode = {
      ...stuff,
      ...reduce(edges, (memo, value, key) => {
        if (Array.isArray(value)) {
          return { ...memo, [key]: map(value, x => x.id) };
        }
        return { ...memo, [key]: value.id };
      }, {}),
    };
    const normalizedEdges = deserialize({}, edges);

    return mergeDeep(acc, {
      [normalizedNode.id]: normalizedNode,
      ...normalizedEdges,
    });
  }, initial);
}

export default function graphql(state = {}, action, normalize = deserialize) {
  const { type, payload, error } = action;

  if (error) {
    return state;
  }

  switch (type) {
    case ACTION_TYPE:
      const nextState = normalize(state, payload);
      console.log('state', nextState);
      return nextState;
    default:
      return state;
  }
}
