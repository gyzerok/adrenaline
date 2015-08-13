/* @flow */

import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
} from 'graphql';
import { find } from './data';

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
});

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
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
});
