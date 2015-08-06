import test from 'tape';
import createReducer from '../createReducer';

test('createReducer should correctly append query results', assert => {
  const initialState = {};
  const store = createReducer();

  const payload1 = {
    todos: [
      { _id: 1, text: 'todo1' },
      { _id: 2, text: 'todo2' },
      { _id: 3, text: 'todo3' },
    ],
  };
  const payload2 = {
    todos: [
      { _id: 2, text: 'modified-todo2' },
      { _id: 4, text: 'todo4' },
    ],
  };

  const state1 = store(initialState, {
    type: 'REDUX_GRAPHQL_ACTION',
    payload: payload1,
  });
  const state2 = store(state1, {
    type: 'REDUX_GRAPHQL_ACTION',
    payload: payload2,
  });

  assert.deepEqual(state1.todos, {
    1: { _id: 1, text: 'todo1' },
    2: { _id: 2, text: 'todo2' },
    3: { _id: 3, text: 'todo3' },
  });

  assert.deepEqual(state2.todos, {
    1: { _id: 1, text: 'todo1' },
    2: { _id: 2, text: 'modified-todo2' },
    3: { _id: 3, text: 'todo3' },
    4: { _id: 4, text: 'todo4' },
  });

  assert.end();
});
