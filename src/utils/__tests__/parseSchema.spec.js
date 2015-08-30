import test from 'tape';
import {
  graphql,
  GraphQLSchema,
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
} from 'graphql';
import parseSchema from '../parseSchema'

const data = {
  User: {
    'u-1': {
      id: 'u-1',
      name: 'User1',
      todos: ['t-1', 't-2'],
    }
  },
  Todo: {
    't-1': {
      id: 't-1',
      text: 'Hello',
    },
    't-2': {
      id: 't-1',
      text: 'World',
    }
  }
}

const todoType = new GraphQLObjectType({
  name: 'Todo',
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    text: {
      type: GraphQLString,
    }
  })
});

const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString
    },
    todos: {
      type: new GraphQLList(todoType),
      resolve: (user) => user.todos.map(id => data.Todo[id]),
    }
  })
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      viewer: {
        type: userType,
        resolve: (root) => {
          return root.User['u-1'];
        },
      }
    }),
  }),
});

test('parseSchema', assert => {
  const expected = {
    Query: {
      viewer: 'User',
    },
    User: {
      todos: ['Todo'],
    },
    Todo: {},
  }
  assert.deepEqual(parseSchema(schema), expected);
  assert.end();
});
