/* @flow */

import { reduce } from './transformers';

export function compileQuery(query: string, params: Object): string {
  return reduce(params, (acc, val, key) => {
    return acc.replace(new RegExp('<' + key + '>', 'g'), val);
  }, query);
}
