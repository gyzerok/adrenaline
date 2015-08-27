/* @flow */

import { map, reduce } from 'lodash';
import merge from './merge';

export default function normalize(initial, data) {
  return reduce(data, (acc, node) => {
    const { edges, ...stuff } = node;

    if (Array.isArray(node)) {
      return merge(acc, {
        ...reduce(node, (memo, value) => {
          return { ...memo, [value.id]: value };
        }, {}),
      });
    }

    if (!edges) {
      return merge(acc, { [node.id]: node });
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

    return merge(acc, {
      [node.id]: normalizedNode,
      ...normalizedEdges,
    });
  }, initial);
}
