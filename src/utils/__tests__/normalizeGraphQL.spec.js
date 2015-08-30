import test from 'tape';
import {
  graphql,
  GraphQLSchema,
  GraphQLString,
  GraphQLObjectType,
} from 'graphql';
import normalizeGraphQL from '../normalizeGraphQL';

const data = {
  User: {
    'u-1': {
      id: 'u-1',
      name: 'User1',
      todo: 't-1',
    }
  },
  Todo: {
    't-1': {
      id: 't-1',
      text: 'Hello',
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
    todo: {
      type: todoType,
      resolve: (user) => data.Todo[user.todo],
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

test('normalizeGraphQL', assert => {
  const query = `
    query Test {
      viewer {
        id,
        name,
        todo {
          id,
          text
        }
      }
    }
  `;
  graphql(schema, query, data).then(res => {
    assert.deepEqual(normalizeGraphQL(res.data), data);

    assert.end();
  });
});
