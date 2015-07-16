/* @flow */

import React, { Component, PropTypes } from 'react';

export default export class GraphQLConnector extends Component {
  static propTypes = {
    endpoint: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired,
  }

  static childContextTypes = {
    graphQLRefresh: PropTypes.func.isRequired,
  }

  getChildContext() {
    return {
      graphQLRefresh: this.onGraphQLRefresh,
    };
  }

  componentWillMount() {
    this.onGraphQLRefresh();
  }

  onGraphQLRefresh = () => {
    const { endpoint, dispatch, children } = this.props;
    const query = reduce(children.type.getQuery(), (acc, val, key) => {
      return acc + '\n' + key + ': ' + val;
    }, '');
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
        dispatch({
          type: ACTION_TYPE,
          payload: json.data,
        });
      });
  }

  render() {
    return React.addons.cloneWithProps(this.props.children);
  }
}
