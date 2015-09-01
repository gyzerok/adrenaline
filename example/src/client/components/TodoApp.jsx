/* @flow */

import React, { Component, PropTypes } from 'react';
import TodoList from 'client/components/TodoList';
import * as todoMutations from '../mutations/todo';
import { createSmartComponent } from '../../../../src';

class TodoApp extends Component {
  static propTypes = {
    todos: PropTypes.object,
    mutations: PropTypes.object.isRequired,
  }

  render() {
    const { todos, mutations } = this.props;

    return (
      <TodoList todos={todos} mutations={mutations} />
    );
  }
}

export default createSmartComponent(TodoApp, {
  query: () => `
    query AppQuery {
      ${TodoList.getFragment('todos')}
    }
  `,
  mutations: todoMutations,
});
