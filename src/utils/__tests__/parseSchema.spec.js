import test from 'tape';
import {
  graphql,
  GraphQLSchema,
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';
import parseSchema from '../parseSchema'

const todoType = new GraphQLObjectType({
  name: 'Todo',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
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
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: GraphQLString
    },
    todos: {
      type: new GraphQLList(todoType),
    }
  })
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      viewer: {
        type: userType,
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
