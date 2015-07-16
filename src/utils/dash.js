/* @flow */

export function map(obj, predicate) {
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = predicate(obj[key], key);
    }
  }
  return result;
}

export function reduce(obj, predicate, initial) {
  let acc = initial;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      acc = predicate(acc, obj[key], key);
    }
  }
  return acc;
}
