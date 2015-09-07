/* @flow */

export const createTodo = {
  mutation: `
    mutation AppMutation($text: String) {
      createTodo(text: $text) {
        id,
        text,
        createdAt,
        owner {
          id
        }
      }
    }
  `,
  collisionKey: ({ id }) => `todo_${id}`,
  updateCache: [
    (todo) => ({
      parentId: todo.owner.id,
      parentType: 'User',
      resolve: (parent) => {
        return {
          ...parent,
          todos: parent.todos.concat(todo.id),
        };
      },
    }),
  ],
};

export const removeTodo = {
  mutation: ({ id }) => `
    mutation AppMutation {
      removeTodo(id: ${id}) {
        id,
        text,
        createdAt,
        owner {
          id
        }
      }
    }
  `,
  collisionKey: ({ id }) => `todo_${id}`,
  updateCache: [
    (todo) => ({
      parentId: todo.owner.id,
      resolve: (parent) => parent,
    }),
  ],
};
