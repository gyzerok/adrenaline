jest.dontMock('lodash');
jest.dontMock('../../utils/compileQuery');

describe('compileQuery', () => {
  it('should correctly compile query', () => {
    const compileQuery = require('../../utils/compileQuery');

    const queries = {
      todos: `
        todos(count: <count>) {
          _id,
          ... on Todo {
            text
          }
        }
      `,
    }
    const params = {
      count: 5,
    };

    const compiled = compileQuery(queries, params);

    expect(compiled).toEqual(`
      todos: todos(count: 5) {
        _id,
        ... on Todo {
          text
        }
      }
    `.replace(/\s+/g, ' ').trim());
  });
});
