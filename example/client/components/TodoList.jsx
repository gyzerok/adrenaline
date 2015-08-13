/* @flow */

import React, { Component, PropTypes } from 'react';
import TodoInput from './TodoInput';
import TodoItem from './TodoItem';
import { createGraphQLContainer as createContainer } from '../../../src';

class TodoList extends Component {
  static propTypes = {
    actions: PropTypes.object,
    todos: PropTypes.array,
  }

  static defaultProps = {
    todos: [],
  }

  render() {
    const { createTodo } = this.props.actions;
    return (
      <div>
        <TodoInput createTodo={createTodo} />
        <ul>
          {this.props.todos.map(todo =>
            <TodoItem key={todo._id} todo={todo} />
          )}
        </ul>
      </div>
    );
  }
}

export default createContainer(TodoList, {
  params: {
    count: 5,
  },
  queries: {
    todos: ({ count }) => `
      query {
        todos(count: ${count}) {
          _id,
          ${TodoItem.getFragment('todo')}
        }
      }
    `,
  },
});
