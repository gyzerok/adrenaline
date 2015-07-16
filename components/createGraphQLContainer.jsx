/* @flow */

import React, { Componenet, PropTypes } from 'react';

export default function createGraphQLContainer(ComposedComponent, { queries = {}, queryParams = {} }) {
  let _queryParams = { ...queryParams };

  return class extends Component {
    static displayName = `GraphQLContainer(${getDisplayName(ComposedComponent)})`;

    static contextTypes = {
      graphQLRefresh: PropTypes.func.isRequired,
    }

    static getQuery = (key) => {
      const compiledQueries = map(queries, q => compileQuery(q, _queryParams));
      return !key ? compiledQueries : '... on ' + compiledQueries[key];
    }

    componentWillMount() {
      this.context.graphQLRefresh();
    }

    setQueryParams = (nextParams) => {
      _queryParams = {
        ...queryParams,
        ...nextParams,
      };
      this.forceUpdate();
      this.context.graphQLRefresh();
    }

    render() {
      return (
        <ComposedComponent {...this.props}
          queryParams={{..._queryParams}}
          setQueryParams={this.setQueryParams} />
      );
    }
  };
}
