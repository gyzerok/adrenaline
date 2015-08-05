/* @flow */

export function trace(tag) {
  return x => {
    console.log(tag, x);
    return x;
  };
}

export function replaceObj(str: string, params: Object): string {
  let result = str;
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      result = result.replace(new RegExp('<' + key + '>', 'g'), params[key]);
    }
  }
  return result;
}

export function isString(value: any): boolean {
  return typeof value === 'string' || value instanceof String;
}
