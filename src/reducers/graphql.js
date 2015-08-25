/* @flow */

import { map, mapKeys, reduce } from 'lodash';
import mergeDeep from 'deepmerge';
import { ACTION_TYPE } from '../constants';

function isEdge(node) {
  if (Array.isArray(node) && node.length) {
    return node[0].hasOwnProperty('id');
  }
  return node.hasOwnProperty('id');
}

export function deserialize(initial, data = {}) {
  return reduce(data, (acc, node) => {
    if (!isEdge(node)) {
      return acc;
    }

    const edges = reduce(node, (memo, value, key) => {
      return isEdge(value) ? { ...memo, [key]: value } : memo;
    }, {});
    let normalizedNode = {};
    if (!Array.isArray(node)) {
      normalizedNode = {
        [node.id]: reduce(node, (memo, value, key) => {
          if (!edges.hasOwnProperty(key)) {
            return { ...memo, [key]: value };
          }
          if (Array.isArray(value)) {
            return { ...memo, [key]: map(value, x => x.id) };
          }
          return { ...memo, [key]: value.id };
        }, {}),
      };
    }
    const normalizedEdges = deserialize({}, edges);

    return mergeDeep(acc, {
      ...normalizedNode,
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
