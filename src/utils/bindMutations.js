/* @flow */

import { mapValues } from 'lodash';
import request from './request';
import { ACTION_TYPE } from '../constants';

export default function bindMutations(endpoint, mutations, dispatch) {
  return mapValues(mutations, m => {
    return (...args) => request(endpoint, { mutation: m(...args) })
      .then(json => {
        dispatch({ type: ACTION_TYPE, payload: json.data });
      })
      .catch(err => {
        dispatch({ type: ACTION_TYPE, payload: err, error: true });
      });
  });
}
