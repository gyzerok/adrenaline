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
          todos: [...parent.todos, todo.id],
        };
      },
    }),
  ],
};
