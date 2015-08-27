/* @flow */

import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
} from 'graphql';

const todoType = new GraphQLObjectType({
  name: 'Todo',
  description: 'Todo type',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Todo id',
    },
    text: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Todo text',
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Todo creation date',
    },
  }),
});

const userEdges = new GraphQLObjectType({
  name: 'UserEdge',
  fields: () => ({
    todos: {
      type: new GraphQLList(todoType),
      description: 'User todos',
      args: {
        count: {
          name: 'count',
          type: GraphQLInt,
        },
      },
      resolve: (user, params, { rootValue: root }) => {
        if (__CLIENT__) {
          return user.todos.map(t => root[t]);
        }
        return root.findTodo(params);
      },
    },
  }),
});

const userType = new GraphQLObjectType({
  name: 'User',
  description: 'User type',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'User id',
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'User name',
    },
    edges: {
      type: userEdges,
      resolve: (user) => user,
    },
  }),
});

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      viewer: {
        type: userType,
        resolve: (root) => {
          if (__CLIENT__) {
            return root['u-1'];
          }
          return root.findUser();
        },
      },
    }),
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      createTodo: {
        type: todoType,
        args: {
          text: {
            name: 'text',
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: (root, params) => {
          return root.createTodo(params);
        },
      },
    }),
  }),
});
