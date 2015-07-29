/* @flow */

import { map, reduce, filter, isString } from './transformers';

export default function compileQuery(queries: string | Object, params: Object): string {
  if (isString(queries)) {
    return reduce(params, (acc, val, key) => {
      return acc.replace(new RegExp('<' + key + '>', 'g'), val);
    }, queries);
  }

  const filteredQueries = filter(queries, q => !q.trim().startsWith('...'));
  const compiledQueries = map(filteredQueries, q => compileQuery(q, params));
  return reduce(compiledQueries, (acc, val, key) => {
    return acc + '\n' + key + ': ' + val;
  }, '');
}
