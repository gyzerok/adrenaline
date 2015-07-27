/* @flow */

import React, { Component, PropTypes } from 'react';
import getDisplayName from '../utils/getDisplayName';
import { map } from '../utils/transformers';
import compileQuery from '../utils/compileQuery';

export default function createGraphQLContainer(ComposedComponent, { queries = {}, queryParams = {} }) {
  let currentParams = { ...queryParams };

  return class extends Component {
    static displayName = `GraphQLContainer(${getDisplayName(ComposedComponent)})`;

    static contextTypes = {
      graphQLRefresh: PropTypes.func.isRequired,
    }

    static getQuery = (key) => {
      const compiledQueries = map(queries, q => compileQuery(q, currentParams));
      return !key ? compiledQueries : '... on ' + compiledQueries[key];
    }

    componentWillMount() {
      this.context.graphQLRefresh();
    }

    setQueryParams = (nextParams) => {
      currentParams = {
        ...queryParams,
        ...nextParams,
      };
      this.forceUpdate();
      this.context.graphQLRefresh();
    }

    render() {
      return (
        <ComposedComponent {...this.props}
          queryParams={{...currentParams}}
          setQueryParams={this.setQueryParams} />
      );
    }
  };
}
