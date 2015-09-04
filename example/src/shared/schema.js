/* @flow */

import {
  GraphQLObjectType,
  GraphQLID,
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
      type: new GraphQLNonNull(GraphQLID),
      description: 'Todo id',
    },
    text: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Todo text',
    },
    owner: {
      type: userType,
      resolve: (todo, _, { rootValue: root }) => {
        if (__CLIENT__) {
          return root.User[todo.owner.id];
        }
        return root.findUser();
      },
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Todo creation date',
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
      type: GraphQLString,
    },
    todos: {
      type: new GraphQLList(todoType),
      args: {
        count: {
          name: 'count',
          type: GraphQLInt,
        },
      },
      resolve: (user, params, { rootValue: root }) => {
        if (__CLIENT__) {
          const todos = user.todos.map(id => root.Todo[id]);
          return params.count ? todos.slice(0, params.count) : todos;
        }
        return root.findTodo(params);
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
        resolve: (root) => {
          if (__CLIENT__) {
            return root.User['u-1'];
          }
          return root.findUser();
        },
      },
    }),
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      upload: {
        type: GraphQLString,
        args: {
          files: {
            name: 'files',
            type: new GraphQLList(GraphQLString),
          },
        },
        resolve: (root, { files }) => {
          return files[0];
        },
      },
      createTodo: {
        type: todoType,
        args: {
          text: {
            name: 'text',
            type: GraphQLString,
          },
        },
        resolve: (root, params) => {
          return root.createTodo(params);
        },
      },
    }),
  }),
});
