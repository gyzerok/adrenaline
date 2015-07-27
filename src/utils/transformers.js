/* @flow */

export function map(obj: Object, predicate: Function): Object {
  let result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = predicate(obj[key], key);
    }
  }
  return result;
}

export function reduce(obj: Object, predicate: Function, initial: any): any {
  let acc = initial;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      acc = predicate(acc, obj[key], key);
    }
  }
  return acc;
}
