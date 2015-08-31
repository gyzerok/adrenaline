/* @flow */

let idx = 4;
let data = {
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
  return count ? data.todos.slice(0, count) : data.todos;
}

export function createTodo({ text }) {
  const todo = {
    id: 't-' + idx++,
    text: text,
    createdAt: (new Date()).toString(),
  };
  data.todos = [todo].concat(data.todos);
  return todo;
}

export function findUser() {
  return data.users[0];
}
