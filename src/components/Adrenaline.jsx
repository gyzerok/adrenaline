import React, { Component, PropTypes } from 'react';

import performQuery from '../network/performQuery';
import performMutation from '../network/performMutation';


export default class Adrenaline extends Component {
  static childContextTypes = {
    query: PropTypes.func,
    mutate: PropTypes.func,
  }

  static propTypes = {
    endpoint: PropTypes.string,
    children: PropTypes.element.isRequired,
  }

  static defaultProps = {
    endpoint: '/graphql',
  }

  getChildContext() {
    const { endpoint } = this.props;

    return {
      query: (query, variables) => {
        return performQuery(endpoint, query, variables);
      },
      mutate: (...args) => performMutation(endpoint, ...args),
    };
  }

  render() {
    const { children } = this.props;
    return children;
  }
}
