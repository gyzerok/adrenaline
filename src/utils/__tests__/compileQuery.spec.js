import test from 'tape';
import compileQuery from '../compileQuery';

test('compileQuery should correctly compile query', assert => {
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
  const expected = `
    todos: todos(count: 5) {
      _id,
      ... on Todo {
        text
      }
    }
  `.replace(/\s+/g, ' ').trim();

  const compiled = compileQuery(queries, params).replace(/\s+/g, ' ').trim();

  assert.equal(compiled, expected);

  assert.end();
});
