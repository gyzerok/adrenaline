/* @flow */

import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
} from 'graphql';
import { findTodo, createTodo, findUser } from './data';

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
    todos: {
      type: new GraphQLList(todoType),
      description: 'User todos',
      args: {
        count: {
          name: 'count',
          type: GraphQLInt,
        },
      },
      resolve: (user, params) => {
        return findTodo(params);
      },
    },
  }),
});

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      viewer: {
        type: userType,
        resolve: () => {
          return findUser();
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
          return createTodo(params);
        },
      },
    }),
  }),
});
