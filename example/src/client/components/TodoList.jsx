/* @flow */

import React, { Component, PropTypes } from 'react';
import TodoInput from 'client/components/TodoInput';
import TodoItem from 'client/components/TodoItem';
import { createDumbComponent } from '../../../../src';

class TodoList extends Component {
  static propTypes = {
    actions: PropTypes.object,
    viewer: PropTypes.object,
    todos: PropTypes.array,
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
    const createTodo = x => console.log(x);
    return (
      <div>
        <TodoInput createTodo={createTodo} />
        <ul>
          {this.props.todos.map(todo =>
            <TodoItem key={todo.id} todo={todo} />
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
    viewer: ({ count }) => `
      Query {
        viewer {
          id,
          name,
          todos(count: ${count}) {
            id,
            ${TodoItem.getFragment('todo')}
          }
        }
      }
    `,
  },
});
