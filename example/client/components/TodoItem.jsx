/* @flow */

import React, { Component, PropTypes } from 'react';
import { createContainer } from '../../../src';

class TodoItem extends Component {
  static propTypes = {
    todo: PropTypes.object.isRequired,
  }

  render() {
    return (
      <li>{this.props.todo.text}</li>
    );
  }
}

export default createContainer(TodoItem, {
  fragments: {
    todo: () => `
      Todo {
        text
      }
    `,
  },
});
