/* @flow */

import { mapValues } from 'lodash';
import invariant from 'invariant';
import request from './request';
import normalize from './normalize';
import { UPDATE_CACHE } from '../constants';

export default function bindMutations(endpoint, parsedSchema, mutations, dispatch) {
  return mapValues(mutations, m => {
    invariant(
      m.hasOwnProperty('mutation'),
      'You have to declare "mutation" field in your mutation'
    );
    return (...args) => {
      request(endpoint, { query: m.mutation(...args) })
        .then(json => {
          const payload = normalize(parsedSchema, json.data);
          dispatch({ type: UPDATE_CACHE, payload });
        })
        .catch(err => {
          dispatch({ type: UPDATE_CACHE, payload: err, error: true });
        });
      };
  });
}
