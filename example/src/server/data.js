/* @flow */

let idx = 4;
let data = {
  users: [
    {
      id: 'u-1',
      name: 'User',
    },
  ],
  todos: [
    {
      id: 't-1',
      text: 'lets go',
      owner: 'user1',
      createdAt: (new Date()).toString(),
    },
    {
      id: 't-2',
      text: 'ho',
      owner: 'user1',
      createdAt: (new Date()).toString(),
    },
    {
      id: 't-3',
      text: 'hey',
      owner: 'user1',
      createdAt: (new Date()).toString(),
    },
  ],
};

export function findTodoById(id) {
  return data.todos.filter(t => t.id === id)[0];
}

export function findTodo({ count }) {
  return count ? data.todos.slice(-count) : data.todos;
}

export function createTodo({ text, user }) {
  const todo = {
    id: 't-' + idx++,
    text: text,
    owner: user.id,
    createdAt: (new Date()).toString(),
  };
  data = [todo].concat(data);
  return todo;
}

export function findUser() {
  return data.users[0];
}
