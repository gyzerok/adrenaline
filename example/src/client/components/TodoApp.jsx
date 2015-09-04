/* @flow */

import React, { Component, PropTypes, findDOMNode } from 'react';
import TodoList from 'client/components/TodoList';
import * as todoMutations from '../mutations/todo';
import * as fileMutations from '../mutations/file';
import { createSmartComponent } from '../../../../src';

class TodoApp extends Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    mutations: PropTypes.object.isRequired,
  }

  componentDidMount() {
    setTimeout(() => {
      this.setArgs({ count: 10 });
    }, 2000);
  }

  onFile = () => {
    const { fileInput } = this.refs;
    const files = findDOMNode(fileInput).files;
    console.log(files);

    const { upload } = this.props.mutations;
    upload({}, files);
  }

  render() {
    const { viewer, mutations } = this.props;

    return (
      <div>
        <TodoList todos={viewer.todos} mutations={mutations} />
        <input ref="fileInput" type="file" onChange={this.onFile} />
      </div>
    );
  }
}

export default createSmartComponent(TodoApp, {
  initialArgs: {
    count: 2,
  },
  query: `
    query TodoApp($count: Int) {
      viewer {
        id,
        ${TodoList.getFragment('todos')}
      }
    }
  `,
  mutations: {
    ...todoMutations,
    ...fileMutations,
  },
});
