/* @flow */

import React, { Component, PropTypes } from 'react';
import { createDumbComponent } from '../../../src';

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

export default createDumbComponent(TodoItem, {
  fragments: {
    todo: () => `
      Todo {
        text
      }
    `,
  },
});
