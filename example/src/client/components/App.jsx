/* @flow */

import React, { Component, PropTypes } from 'react';
import TodoList from 'client/components/TodoList';
import { createSmartComponent } from '../../../../src';
import schema from 'shared/schema';

class App extends Component {
  static propTypes = {
    viewer: PropTypes.object,
  }

  static defaultProps = {
    viewer: {
      edges: {},
    },
  }

  render() {
    const { todos } = this.props.viewer.edges;
    return (
      <TodoList todos={todos} />
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
