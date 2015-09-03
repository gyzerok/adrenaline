/* @flow */

import React, { Component, PropTypes } from 'react';
import invariant from 'invariant';
import getDisplayName from '../utils/getDisplayName';
import { isString } from 'lodash';

export default function createDumbComponent(DecoratedComponent: Component, specs: Object) {
  const { initialArgs, fragments } = specs;
  let currentArgs = { ...initialArgs };
  const displayName = `DumbComponent(${getDisplayName(DecoratedComponent)})`;

  return class extends Component {
    static displayName = displayName;
    static DecoratedComponent = DecoratedComponent;

    static contextTypes = {
      update: PropTypes.func.isRequired,
    }

    static getFragment(key) {
      invariant(
        isString(key),
        'You cant call getFragment(key: string) without string key in %s',
        displayName
      );

      return '... on ' + fragments[key](currentArgs).replace(/\s+/g, ' ').trim();
    }

    constructor(props, context) {
      super(props, context);
      this.state = {
        args: currentArgs,
      };
      currentArgs = this.state.args;
      //this.context.update();
    }

    componentDidMount() {
      console.log('child mount');
    }

    setArgs(nextArgsSlice) {
      currentArgs = {
        ...currentArgs,
        ...nextArgsSlice,
      };
      console.log(nextArgsSlice);
      this.setState({ args: nextArgsSlice });
      this.context.update();
    }

    render() {
      return (
        <DecoratedComponent {...this.props}
          args={this.state.args}
          setArgs={this.setArgs.bind(this)} />
      );
    }
  };
}
