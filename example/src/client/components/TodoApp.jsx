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

  componentDidMount() {
    setTimeout(() => {
      this.setArgs({ count: 3 });
    }, 2000);
  }

  render() {
    const { viewer, mutations } = this.props;

    return (
      <TodoList todos={viewer.todos} mutations={mutations} />
    );
  }
}

export default createSmartComponent(TodoApp, {
  initialArgs: () => ({
    count: 2,
  }),
  query: (args) => `
    query TodoApp {
      viewer {
        id,
        ${TodoList.getFragment('todos', args)}
      }
    }
  `,
  mutations: todoMutations,
});
