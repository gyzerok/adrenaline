/* @flow */

import { map, reduce } from 'lodash';
import mergeDeep from 'deepmerge';

function edgePredicate(idName) {
  return node => {
    if (Array.isArray(node) && node.length) {
      return node[0].hasOwnProperty(idName);
    }
    return node.hasOwnProperty(idName);
  };
}

export default function normalize(idName) {
  const isEdge = edgePredicate(idName);

  return initial => data => {
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
          [node[idName]]: reduce(node, (memo, value, key) => {
            if (!edges.hasOwnProperty(key)) {
              return { ...memo, [key]: value };
            }
            if (Array.isArray(value)) {
              return { ...memo, [key]: map(value, x => x[idName]) };
            }
            return { ...memo, [key]: value[idName] };
          }, {}),
        };
      }
      const normalizedEdges = normalize({}, edges);

      return mergeDeep(acc, {
        ...normalizedNode,
        ...normalizedEdges,
      });
    }, initial);
  };
}
