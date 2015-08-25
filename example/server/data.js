/* @flow */

let idx = 4;
let data = {
  users: [
    {
      id: 'user1',
      name: 'User',
    },
  ],
  todos: [
    {
      id: 3,
      text: 'lets go',
      owner: 'user1',
      createdAt: (new Date()).toString(),
    },
    {
      id: 2,
      text: 'ho',
      owner: 'user1',
      createdAt: (new Date()).toString(),
    },
    {
      id: 1,
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
    id: idx++,
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
