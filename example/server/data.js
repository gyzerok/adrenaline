/* @flow */

const data = {
  todos: [
    {
      _id: 3,
      text: 'lets go',
      createdAt: (new Date()).toString(),
    },
    {
      _id: 2,
      text: 'ho',
      createdAt: (new Date()).toString(),
    },
    {
      _id: 1,
      text: 'hey',
      createdAt: (new Date()).toString(),
    },
  ],
};

export function findById(id) {
  return data.todos.filter(t => t._id === id)[0];
}

export function find({ count }) {
  return data.todos.slice(-count);
}
