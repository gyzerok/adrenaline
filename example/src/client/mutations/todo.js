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

export const removeTodo = (id) => `
  mutation AppMutation {
    removeTodo(id: ${id}) {
      id,
      text,
      createdAt
    }
  }
`;
