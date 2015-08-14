/* @flow */

import React, { Component, PropTypes } from 'react';
import invariant from 'invariant';
import getDisplayName from '../utils/getDisplayName';
import { isString } from '../utils/helpers';
import compileQuery from '../utils/compileQuery';

export default function createGraphQLContainer(DecoratedComponent: Component, specs: Object) {
  const { params, queries, fragments } = specs;
  let currentParams = { ...params };
  const displayName = `Adrenaline(${getDisplayName(DecoratedComponent)})`;

  return class extends Component {
    static displayName = displayName;
    static DecoratedComponent = DecoratedComponent;

    static contextTypes = {
      fetch: PropTypes.func.isRequired,
    }

    static getQuery(key: String) {
      return compileQuery(queries[key], currentParams);
    }

    static getFragment(key: String) {
      invariant(
        isString(key),
        'You cant call getFragment() without string key in %s',
        displayName
      );

      return '... on ' + fragments[key](currentParams);
    }

    constructor(props, context) {
      super(props, context);
      this.state = { params };
    }

    componentWillMount() {
      this.context.fetch(compileQuery(queries, params));
    }

    setParams(updates: Object) {
      const nextParams = {
        ...currentParams,
        ...updates,
      };
      currentParams = nextParams;
      this.forceUpdate();
      this.context.fetch(compileQuery(queries, nextParams));
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
