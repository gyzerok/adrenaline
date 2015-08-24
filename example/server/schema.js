/* @flow */

import {
  //GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
} from 'graphql';
import { find, create } from './data';

/*const nodeInterface = new GraphQLInterfaceType({
  name: 'Node',
  description: 'Node interface',
  fields: () => ({
    _id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
  resolveType: node => todoType,
});*/

const todoType = new GraphQLObjectType({
  name: 'Todo',
  description: 'Todo model',
  fields: () => ({
    _id: {
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
  //interfaces: [nodeInterface],
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
        resolve: (root, { count }) => {
          return find({ count });
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
          return create(params);
        },
      },
    }),
  }),
});
