/* @flow */

import { mapValues } from 'lodash';

export default function bindMutations(mutations, dispatch) {
  return mapValues(mutations, m => {
    return (...args) => dispatch(
      fetch(m(...args))
    );
  };
}
