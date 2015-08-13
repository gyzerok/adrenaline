/* @flow */

import { isString, filter, mapValues, reduce } from 'lodash';

export default function compileQuery(queries: string | Object, params: Object): string {
  const compiledQueries = mapValues(queries, q => q(params));

  return reduce(compiledQueries, (acc, val, key) => {
    return acc + '\n' + key + ': ' + val;
  }, '');
}
