/* @flow */

import { mapValues } from 'lodash';
import request from './request';
import normalize from './normalize';
import { ACTION_TYPE } from '../constants';

export default function bindMutations(endpoint, parsedSchema, mutations, dispatch) {
  return mapValues(mutations, m => {
    return (...args) => {
      request(endpoint, { query: m(...args) })
        .then(json => {
          const payload = normalize(parsedSchema, json.data);
          console.log(payload);
          dispatch({ type: ACTION_TYPE, payload });
        })
        .catch(err => {
          dispatch({ type: ACTION_TYPE, payload: err, error: true });
        });
      };
  });
}
