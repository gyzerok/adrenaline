/* @flow */

import React, { Component, PropTypes } from 'react';
import TodoList from 'client/components/TodoList';
import * as todoMutations from '../mutations/todo';
import { createSmartComponent } from '../../../../src';

class App extends Component {
  static propTypes = {
    viewer: PropTypes.object,
    mutations: PropTypes.object.isRequired,
  }

  render() {
    const { viewer, mutations } = this.props;

    return (
      <TodoList todos={viewer.todos} mutations={mutations} />
    );
  }
}

export default createSmartComponent(App, {
  endpoint: '/graphql',
  query: () => `
    query AppQuery {
      ${TodoList.getFragment('viewer')}
    }
  `,
  mutations: todoMutations,
});
