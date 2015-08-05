/* @flow */

import React, { Component, PropTypes } from 'react/addons';
import getDisplayName from '../utils/getDisplayName';
import shadowEqualScalar from '../utils/shadowEqualScalar';
import { ACTION_TYPE } from '../constants';

export default function createGraphQLDecorator(selector) {
  return DecoratedComponent => class extends Component {
    static displayName = `GraphQLDecorator(${getDisplayName(DecoratedComponent)})`;
    static DecoratedComponent = DecoratedComponent;

    static propTypes = {
      endpoint: PropTypes.string.isRequired,
      dispatch: PropTypes.func.isRequired,
    }

    static childContextTypes = {
      graphQLRefresh: PropTypes.func.isRequired,
    }

    getChildContext() {
      return {
        graphQLRefresh: this.onGraphQLRefresh,
      };
    }

    shouldComponentUpdate(nextProps) {
      return !shadowEqualScalar(this.props, nextProps);
    }

    onGraphQLRefresh = (query: string) => {
      if (!query.trim().length) return;

      const { endpoint, dispatch } = this.props;
      const opts = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: '{' + query + '}' }),
      };
      // TODO: Somehow deal with errors
      fetch(endpoint, opts)
        .then(res => res.json())
        .then(json => {
          dispatch({ type: ACTION_TYPE, payload: json.data });
        });
    }

    render() {
      const Clone = React.addons.cloneWithProps(DecoratedComponent);
      return <Clone />;
    }
  };
}
