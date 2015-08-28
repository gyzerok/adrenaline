/* @flow */

import test from 'tape';
import normalize from '../normalize';

test('normalize correctly works when receives object as root', assert => {
  const denormalizedData = {
    viewer: {
      id: '#1:1',
      name: 'User',
      edges: {
        todos: [
          {
            id: '#2:1',
            text: 'One'
          },
          {
            id: '#2:2',
            text: 'Two'
          },
          {
            id: '#2:3',
            text: 'Three'
          },
        ],
      },
    },
  };
  const normalizedData = {
    '#1:1': {
      id: '#1:1',
      name: 'User',
      todos: ['#2:1', '#2:2', '#2:3'],
    },
    '#2:1': {
      id: '#2:1',
      text: 'One',
    },
    '#2:2': {
      id: '#2:2',
      text: 'Two',
    },
    '#2:3': {
      id: '#2:3',
      text: 'Three',
    },
  };

  assert.deepEqual(normalize({}, denormalizedData), normalizedData);

  assert.end();
});

test('normalize correctly works when receives array as root', assert => {
  const denormalizedData = {
    todos: [
      {
        id: '#2:1',
        text: 'One',
        edges: {
          user: { id: '#1:1', name: 'User' }
        },
      },
      {
        id: '#2:2',
        text: 'Two',
        edges: {
          user: { id: '#1:1', name: 'User' }
        },
      },
      {
        id: '#2:3',
        text: 'Three',
        edges: {
          user: { id: '#1:1', name: 'User' }
        },
      },
    ],
  };
  const normalizedData = {
    '#1:1': {
      id: '#1:1',
      name: 'User',
    },
    '#2:1': {
      id: '#2:1',
      text: 'One',
      user: '#1:1',
    },
    '#2:2': {
      id: '#2:2',
      text: 'Two',
      user: '#1:1',
    },
    '#2:3': {
      id: '#2:3',
      text: 'Three',
      user: '#1:1',
    },
  };

  assert.deepEqual(normalize({}, denormalizedData), normalizedData);

  assert.end();
});
