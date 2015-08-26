/* @flow */

import test from 'tape';
import normalize from '../normalize';

test('normalize correctly deserialize data', assert => {
  const denormalizedData = {
    viewer: {
      id: 'u-1',
      name: 'User',
      edges: {
        todos: [
          {
            id: 't-1',
            text: 'One'
          },
          {
            id: 't-2',
            text: 'Two'
          },
          {
            id: 't-3',
            text: 'Three'
          },
        ],
      },
    },
  };
  const normalizedData = {
    'u-1': {
      id: 'u-1',
      name: 'User',
      todos: ['t-1', 't-2', 't-3'],
    },
    't-1': {
      id: 't-1',
      text: 'One',
    },
    't-2': {
      id: 't-2',
      text: 'Two',
    },
    't-3': {
      id: 't-3',
      text: 'Three',
    },
  };

  assert.deepEqual(normalize({}, denormalizedData), normalizedData);

  assert.end();
});
