/* @flow */

import React, { Component, PropTypes } from 'react';
import TodoList from 'client/components/TodoList';
import * as todoMutations from '../mutations/todo';
import { createSmartComponent } from '../../../../src';

class TodoApp extends Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    mutations: PropTypes.object.isRequired,
  }

  render() {
    const { viewer, mutations } = this.props;

    return (
      <TodoList todos={viewer.todos} mutations={mutations} />
    );
  }
}

export default createSmartComponent(TodoApp, {
  query: () => `
    query AppQuery {
      viewer {
        id,
        ${TodoList.getFragment('todos')}
      }
    }
  `,
  mutations: todoMutations,
});
