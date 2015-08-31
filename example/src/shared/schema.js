/* @flow */

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
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

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      todos: {
        type: new GraphQLList(todoType),
        args: {
          count: {
            name: 'count',
            type: GraphQLInt,
          },
        },
        resolve: (root, args) => {
          if (__CLIENT__) {
            return Object.values(root.Todo).slice(0, args.count);
          }
          return root.findTodo(args);
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
