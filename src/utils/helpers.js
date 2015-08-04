/* @flow */

/*export function map(obj: Object, predicate: Function): Object {
  let result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = predicate(obj[key], key);
    }
  }
  return result;
}

export function reduce(obj: Object | Array, predicate: Function, initial: any): any {
  if (Array.isArray(obj)) {
    return obj.reduce(predicate, initial);
  }

  let acc = initial;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      acc = predicate(acc, obj[key], key);
    }
  }
  return acc;
}

export function filter(obj: Object, predicate: Function): Object {
  let result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && predicate(obj[key])) {
      result[key] = obj[key];
    }
  }
  return result;
}*/

export function trace(tag) {
  return x => {
    console.log(tag, x);
    return x;
  };
}

export function replaceObj(str: string, params: Object): string {
  console.log(str);
  let result = str;
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      result = result.replace(new RegExp('<' + key + '>', 'g'), params[key]);
    }
  }
  console.log('REPLACE!!!', result);
  return result;
}

export function isString(value: any): boolean {
  return typeof value === 'string' || value instanceof String;
}
