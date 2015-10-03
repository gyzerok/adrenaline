/* @flow */

import React, { Component, PropTypes, findDOMNode } from 'react';
import TodoList from './TodoList';
import { createSmartComponent } from '../../../../../src';

class TodoApp extends Component {
  static propTypes = {
    todos: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  componentDidMount() {
    setTimeout(() => {
      this.setVariables({ count: 10 });
    }, 2000);
  }

  render() {
    const { todo } = this.props;

    return (
      <TodoList todos={todo} />
    );
  }
}

export default createSmartComponent(TodoApp, {
  initialVariables: {
    count: 2,
  },
  query: (variables)=>{
      return {
          todo: {
              count: variables.count
          }
      }
  }
});
