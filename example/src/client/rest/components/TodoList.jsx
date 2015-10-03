/* @flow */

import React, { Component, PropTypes } from 'react';
import TodoInput from './TodoInput';
import TodoItem from './TodoItem';
import { createDumbComponent } from '../../../../../src';

export default class TodoList extends Component {
  static propTypes = {
    todos: PropTypes.array
  }

  static defaultProps = {
    todos: [],
  }

  render() {
    const createTodo = function(){}
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
