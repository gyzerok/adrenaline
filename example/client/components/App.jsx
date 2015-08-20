/* @flow */

import React, { Component, PropTypes } from 'react';
import TodoList from './TodoList';
import { createSmartComponent } from '../../../src';

class App extends Component {
  static propTypes = {
    todos: PropTypes.object.isRequired,
  }

  static defaultProps = {
    todos: {},
  }

  render() {
    const todos = Object.keys(this.props.todos).map(key => this.props.todos[key]);

    return (
      <TodoList todos={todos} />
    );
  }
}

export default createSmartComponent(App, {
  endpoint: '/graphql',
  query: () => `
    query QueryNameHere {
      ${TodoList.getFragment('todos')}
    }
  `,
});
