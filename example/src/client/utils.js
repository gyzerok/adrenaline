/* @flow */

import { reduce, mapValues } from 'lodash';
const merge = () => null;

export function normalize(parsedSchema, initial, data) {
  let bag = { ...initial };
  normalizeAny(parsedSchema, 'Query', bag, data);

  return bag;
}

function normalizeAny(parsedSchema, typename, bag, data) {
  if (!isDefinedType(typename)) {
    return data;
  }

  if (Array.isArray(typename)) {
    return normalizeArray(parsedSchema, typename[0], bag, data);
  }

  return normalizeType(parsedSchema, typename, bag, data);
}

function normalizeArray(parsedSchema, typename, bag, data) {
  const itemSchema = parsedSchema[typename];
  return data.map(item => normalizeAny(parsedSchema, itemSchema, bag, item));
}

function normalizeObject(parsedSchema, typename, data, bag) {
  const itemSchema = parsedSchema[typename];
  let normalized = {};
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const node = normalizeAny(parsedSchema, itemSchema[key], bag, data[key]);
      normalized[key] = node;
    }
  }
  return normalized;
}

function normalizeType(parsedSchema, typename, bag, data) {
  const id = data.id;

  if (!bag[typename]) {
    bag[typename] = {};
  }

  if (!bag[typename][id]) {
    bag[typename][id] = {};
  }

  let stored = bag[typename][id];
  const normalized = normalizeObject(parsedSchema, typename, bag, data);
  merge(stored, normalized); // swap with my merge

  return id;
}
