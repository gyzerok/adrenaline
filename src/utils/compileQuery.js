/* @flow */

import { map, reduce } from './transformers';

export default function compileQuery(queries: string | Object, params: Object): string {
  if (typeof queries === 'string' || queries instanceof String) {
    return reduce(params, (acc, val, key) => {
      return acc.replace(new RegExp('<' + key + '>', 'g'), val);
    }, queries);
  }

  const compiledQueries = map(queries, q => compileQuery(q, params));
  return reduce(compiledQueries, (acc, val, key) => {
    return acc + '\n' + key + ': ' + val;
  });
}
