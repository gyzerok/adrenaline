/* @flow */

import React, { Component, PropTypes } from 'react';
import TodoList from 'client/components/TodoList';
import { createSmartComponent, bindMutations } from '../../../../src';
import * as mutations from 'client/mutations/todo'

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
    const { dispatch } = this.props;
    const { todos } = this.props.viewer.edges;
    
    return (
      <TodoList todos={todos} mutations={bindMutations(mutations, dispatch)} />
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
});
