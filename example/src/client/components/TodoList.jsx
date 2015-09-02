/* @flow */

import React, { Component, PropTypes } from 'react';
import TodoInput from 'client/components/TodoInput';
import TodoItem from 'client/components/TodoItem';
import { createDumbComponent } from '../../../../src';

class TodoList extends Component {
  static propTypes = {
    mutations: PropTypes.object,
    todos: PropTypes.array,
    setParams: PropTypes.func.isRequired,
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
    todos: () => `
      User {
        todos {
          id,
          ${TodoItem.getFragment('todo')}
        }
      }
    `,
  },
});
