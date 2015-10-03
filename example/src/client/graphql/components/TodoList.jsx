/* @flow */

import React, { Component, PropTypes } from 'react';
import TodoInput from './TodoInput';
import TodoItem from './TodoItem';
import { createDumbComponent } from '../../../../../src';

class TodoList extends Component {
  static propTypes = {
    mutations: PropTypes.object.isRequired,
    todos: PropTypes.array,
  }

  static defaultProps = {
    todos: [],
  }

  render() {
    const { createTodo } = this.props.mutations;
    return (
      <div>
        <TodoInput createTodo={createTodo} />
        <ul>
          {this.props.todos.map(todo =>
            <TodoItem todo={todo} />
          )}
        </ul>
      </div>
    );
  }
}

export default createDumbComponent(TodoList, {
  fragments: {
    todos: `
      User {
        todos(count: $count) {
          id,
          ${TodoItem.getFragment('todo')}
        }
      }
    `,
  },
});
