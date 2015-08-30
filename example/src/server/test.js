import test from 'tape';
import {
  graphql,
  GraphQLSchema,
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
} from 'graphql';
import normalize from '../../../src/utils/normalize';
import parseSchema from '../../../src/utils/parseSchema';

const todoType = new GraphQLObjectType({
  name: 'Todo',
  fields: () => ({
    id: {
      type: GraphQLString,
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
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
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

const data = {
  User: {
    'u-1': {
      id: 'u-1',
      name: 'User1',
      todos: ['t-1', 't-2'],
    },
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
    console.log(normalized);
  })
  .catch(err => console.error(err, err.stack));
