/* @flow */

import React, { Component, PropTypes } from 'react';
import TodoList from 'client/components/TodoList';
import * as todoMutations from '../mutations/todo';
import { createSmartComponent } from '../../../../src';

class App extends Component {
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

export default createSmartComponent(App, {
  query: () => `
    query AppQuery {
      ${TodoList.getFragment('todos')}
    }
  `,
  mutations: todoMutations,
});
