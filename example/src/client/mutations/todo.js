/* @flow */

export const createTodo = (text) => `
  mutation AppMutation {
    createTodo(text: "${text}") {
      id,
      text,
      createdAt
    }
  }
`;

export const test = {
  mutation: ({ text }) => `
    mutation AppMutation {
      createTodo(text: "${text}") {
        id,
        text,
        createdAt
      }
    }
  `,
  collisionKey: () => 'hello',
  resolve: (todo) => ({
    type: 'ADD',
    strategy: 'APPEND',
    id: todo.id,
    parentId: todo.user.id,
  }),
};

export const removeTodo = (id) => `
  mutation AppMutation {
    removeTodo(id: ${id}) {
      id,
      text,
      createdAt
    }
  }
`;
