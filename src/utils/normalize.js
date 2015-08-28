/* @flow */

import { map, reduce } from 'lodash';
import merge from './merge';

export default function normalize(initial, data) {
  return reduce(data, (acc, node) => {
    if (Array.isArray(node)) {
      return merge(acc, {
        ...reduce(node, normalizeOne, initial),
      });
    }

    return normalizeOne(initial, node);
  }, initial);
}

function normalizeOne(initial, node) {
  const { edges, ...stuff } = node;

  if (!edges) {
    return merge(initial, { [node.id]: node });
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
  const normalizedEdges = normalize({}, edges);

  return merge(initial, {
    [node.id]: normalizedNode,
    ...normalizedEdges,
  });
}
