/* @flow */

export const createTodo = (text) => `
  mutation createTodo(text: ${text}) {
    id,
    text,
    createdAt
  }
`;

export const removeTodo = (id) => `
  mutation removeTodo(id: ${id}) {
    id,
    text,
    createdAt
  }
`;
