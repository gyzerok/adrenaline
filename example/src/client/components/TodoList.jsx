/* @flow */

import React, { Component, PropTypes } from 'react';
import TodoInput from 'client/components/TodoInput';
import TodoItem from 'client/components/TodoItem';
import { createDumbComponent } from '../../../../src';

class TodoList extends Component {
  static propTypes = {
    mutations: PropTypes.object,
    todos: PropTypes.array,
    args: PropTypes.object.isRequired,
    setArgs: PropTypes.func.isRequired,
  }

  static defaultProps = {
    todos: [],
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.setArgs({ count: this.props.args.count + 2 });
    }, 2000);
  }

  render() {
    const { createTodo } = this.props.mutations;
    return (
      <div>
        <TodoInput createTodo={createTodo} />
        <ul>
          {this.props.todos.map(todo =>
            <TodoItem todo={todo} />
          )}
        </ul>
      </div>
    );
  }
}

export default createDumbComponent(TodoList, {
  initialArgs: {
    count: 1,
  },
  fragments: {
    todos: ({ count }) => `
      User {
        todos(count: ${count}) {
          id,
          ${TodoItem.getFragment('todo')}
        }
      }
    `,
  },
});
