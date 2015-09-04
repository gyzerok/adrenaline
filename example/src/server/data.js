/* @flow */

let idx = 4;
let data = {
  users: [
    {
      id: 'u-1',
      name: 'User1',
      todos: ['t-1', 't-2', 't-3'],
    },
  ],
  todos: [
    {
      id: 't-1',
      text: 'hey',
      owner: 'u-1',
      createdAt: (new Date()).toString(),
    },
    {
      id: 't-2',
      text: 'ho',
      owner: 'u-1',
      createdAt: (new Date()).toString(),
    },
    {
      id: 't-3',
      text: 'lets go',
      owner: 'u-1',
      createdAt: (new Date()).toString(),
    },
  ],
};

export function findTodoById(id) {
  return data.todos.filter(t => t.id === id)[0];
}

export function findTodo({ count }) {
  return count ? data.todos.slice(0, count) : data.todos;
}

export function createTodo({ text }) {
  const todo = {
    id: 't-' + idx++,
    text: text,
    owner: 'u-1',
    createdAt: (new Date()).toString(),
  };
  data.todos.push(todo);
  return todo;
}

export function findUser() {
  return data.users[0];
}
