/* @flow */

export function compileQuery(query, params) {
  return reduce(params, (acc, val, key) => {
    return acc.replace(new RegExp('<' + key + '>', 'g'), val);
  }, query);
}
