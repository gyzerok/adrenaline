jest.dontMock('lodash');
jest.dontMock('deepmerge');
jest.dontMock('../../utils/createReducer');

describe('createReducer', () => {
  it('should correctly append query results', () => {
    const createReducer = require('../../utils/createReducer');

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

    expect(state1.todos).toEqual({
      1: { _id: 1, text: 'todo1' },
      2: { _id: 2, text: 'todo2' },
      3: { _id: 3, text: 'todo3' },
    });

    expect(state2.todos).toEqual({
      1: { _id: 1, text: 'todo1' },
      2: { _id: 2, text: 'modified-todo2' },
      3: { _id: 3, text: 'todo3' },
      4: { _id: 4, text: 'todo4' },
    });
  });
});
