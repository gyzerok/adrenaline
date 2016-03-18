import React, { Component, PropTypes } from 'react';

import defaultNetworkLayer from '../network/defaultNetworkLayer';


export default class Adrenaline extends Component {
  static childContextTypes = {
    query: PropTypes.func,
    mutate: PropTypes.func,
  }

  static propTypes = {
    endpoint: PropTypes.string,
    networkLayer: PropTypes.object,
    children: PropTypes.element.isRequired,
  }

  static defaultProps = {
    endpoint: '/graphql',
    networkLayer: defaultNetworkLayer,
  }

  getChildContext() {
    const { endpoint, networkLayer } = this.props;

    return {
      query: (query, variables) => {
        return networkLayer.performQuery(endpoint, query, variables);
      },
      mutate: (...args) => {
        return networkLayer.performMutation(endpoint, ...args);
      },
    };
  }

  render() {
    const { children } = this.props;
    return children;
  }
}
