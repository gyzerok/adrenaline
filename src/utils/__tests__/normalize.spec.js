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
import normalize from '../normalize';
import parseSchema from '../parseSchema'

const todoType = new GraphQLObjectType({
  name: 'Todo',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    text: {
      type: GraphQLString,
    },
  }),
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
      resolve: (user, params, { rootValue: root }) => {
        return user.todos.map(id => root.Todo[id]);
      },
    },
  }),
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
      },
    }),
  }),
});

test('normalize', assert => {
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
        id: 't-2',
        text: 'World',
      },
    },
  };

  const parsedSchema = parseSchema(schema);
  const query = `
    query Test {
      viewer {
        id,
        name,
        todos {
          id,
          text
        }
      }
    }
  `;

  graphql(schema, query, data)
    .then(res => {
      const normalized = normalize(parsedSchema, res.data);
      assert.deepEqual(normalized, data);

      assert.end();
    })
    .catch(err => assert.end(err));
});
