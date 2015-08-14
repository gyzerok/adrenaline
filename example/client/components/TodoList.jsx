/* @flow */

import React, { Component, PropTypes } from 'react';
import TodoInput from './TodoInput';
import TodoItem from './TodoItem';
import { createDumbComponent } from '../../../src';

class TodoList extends Component {
  static propTypes = {
    actions: PropTypes.object,
    todos: PropTypes.array.isRequired,
    setParams: PropTypes.func.isRequired,
  }

  static defaultProps = {
    todos: [],
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.setParams({ count: 3 });
    }, 2000);
  }

  render() {
    //const { createTodo } = this.props.actions;
    const createTodo = x => console.log(x);
    return (
      <div>
        <TodoInput createTodo={createTodo} />
        <ul>
          {this.props.todos.map(todo =>
            <TodoItem key={todo._id} todo={todo} />
          )}
        </ul>
      </div>
    );
  }
}

export default createDumbComponent(TodoList, {
  params: {
    count: 2,
  },
  fragments: {
    todos: ({ count }) => `
      RootQueryType {
        todos(count: ${count}) {
          _id,
          ${TodoItem.getFragment('todo')}
        }
      }
    `,
  },
  queries: {
    todos: ({ count }) => `
      todos(count: ${count}) {
        _id,
        ${TodoItem.getFragment('todo')}
      }
    `,
  },
});
