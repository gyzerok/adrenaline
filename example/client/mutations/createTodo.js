/* @flow */

export function createTodo(text) {
  return `
    mutation createTodo(text: ${text}) {
      _id,
      text,
      createdAt
    }
  `;
}
