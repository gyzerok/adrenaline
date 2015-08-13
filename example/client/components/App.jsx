/* @flow */

import React, { Component, PropTypes } from 'react';
import TodoList from './TodoList';
import { connect } from '../../../src';

@connect(state => state)
export default class App extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
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
