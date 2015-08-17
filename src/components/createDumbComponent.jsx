/* @flow */

import React, { Component, PropTypes } from 'react';
import invariant from 'invariant';
import getDisplayName from '../utils/getDisplayName';
import { isString } from '../utils/helpers';

export default function createDumbComponent(DecoratedComponent: Component, specs: Object) {
  const { params, fragments } = specs;
  let currentParams = { ...params };
  const displayName = `DumbComponent(${getDisplayName(DecoratedComponent)})`;

  return class extends Component {
    static displayName = displayName;
    static DecoratedComponent = DecoratedComponent;

    static contextTypes = {
      update: PropTypes.func.isRequired,
    }

    static getFragment(key: String) {
      invariant(
        isString(key),
        'You cant call getFragment(key: string) without string key in %s',
        displayName
      );

      return '... on ' + fragments[key](currentParams).replace(/\s+/g, ' ').trim();
    }

    constructor(props, context) {
      super(props, context);
      this.state = { params };
    }

    componentWillMount() {
      this.context.update();
    }

    setParams(updates: Object) {
      const nextParams = {
        ...currentParams,
        ...updates,
      };
      currentParams = nextParams;
      this.forceUpdate();
      this.context.update();
    }

    render() {
      return (
        <DecoratedComponent {...this.props}
          params={this.state.params}
          setParams={this.setParams.bind(this)} />
      );
    }
  };
}
