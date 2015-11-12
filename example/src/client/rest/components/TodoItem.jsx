/* @flow */

import React, { Component, PropTypes } from 'react';
import { createDumbComponent } from '../../../../../src';

export default class TodoItem extends Component {
  static propTypes = {
    todo: PropTypes.object.isRequired,
  }

  render() {
    const { todo } = this.props;

    return (
      <li>{todo.text}</li>
    );
  }
}
