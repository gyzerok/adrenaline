/* @flow */

import React, { Component, PropTypes } from 'react/addons';
import { reduce } from '../utils/transformers';
import { ACTION_TYPE } from '../constants';

export default class GraphQLConnector extends Component {
  static propTypes = {
    endpoint: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired,
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

  componentWillMount() {
    this.onGraphQLRefresh();
  }

  onGraphQLRefresh = (query) => {
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
      .then(json => dispatch({ type: ACTION_TYPE, payload: json.data }));
  }

  render() {
    return React.addons.cloneWithProps(this.props.children);
  }
}
