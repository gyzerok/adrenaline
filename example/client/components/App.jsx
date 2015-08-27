/* @flow */

import React, { Component, PropTypes } from 'react';
import TodoList from './TodoList';
import { createSmartComponent } from '../../../src';
import schema from '../../shared/schema';

class App extends Component {
  static propTypes = {
    todos: PropTypes.object.isRequired,
  }

  static defaultProps = {
    todos: [],
  }

  render() {
    return (
      <TodoList todos={this.props.todos} />
    );
  }
}

export default createSmartComponent(App, {
  endpoint: '/graphql',
  schema: schema,
  query: () => `
    query AppQuery {
      ${TodoList.getFragment('viewer')}
    }
  `,
});
