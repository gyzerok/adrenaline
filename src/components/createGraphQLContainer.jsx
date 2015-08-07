/* @flow */

import React, { Component, PropTypes } from 'react';
import invariant from 'invariant';
import getDisplayName from '../utils/getDisplayName';
import { isString } from '../utils/helpers';
import compileQuery from '../utils/compileQuery';

export default function createGraphQLContainer(DecoratedComponent, { queries = {}, queryParams = {} }) {
  let currentParams = { ...queryParams };
  const displayName = `GraphQLContainer(${getDisplayName(DecoratedComponent)})`;

  return class extends Component {
    static displayName = displayName;
    static DecoratedComponent = DecoratedComponent;

    static contextTypes = {
      fetch: PropTypes.func.isRequired,
    }

    static getQuery = (key) => {
      invariant(
        isString(key),
        'You cant call getQuery() without key in %s',
        displayName
      );
      return compileQuery(queries[key], currentParams);
    }

    componentWillMount() {
      this.context.fetch(compileQuery(queries, queryParams));
    }

    setQueryParams = (nextParams) => {
      currentParams = {
        ...currentParams,
        ...nextParams,
      };
      this.forceUpdate();
      this.context.fetch(compileQuery(queries, currentParams));
    }

    render() {
      return (
        <DecoratedComponent {...this.props}
          queryParams={{...currentParams}}
          setQueryParams={this.setQueryParams} />
      );
    }
  };
}
