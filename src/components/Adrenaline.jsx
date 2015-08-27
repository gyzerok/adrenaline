/* @flow */

import React, { Component, PropTypes } from 'react';
import Loading from './Loading';
import createStoreShape from '../utils/createStoreShape';

export default class Adrenaline extends Component {
  static childContextTypes = {
    store: createStoreShape(PropTypes).isRequired,
    graphql: PropTypes.func.isRequired,
    renderLoading: PropTypes.object.isRequired,
  };

  static propTypes = {
    children: PropTypes.func.isRequired,
    graphql: PropTypes.func.isRequired,
    renderLoading: PropTypes.object,
  }

  static defaultProps = {
    renderLoading: Loading,
  }

  getChildContext() {
    return {
      store: this.state.store,
      graphql: this.props.graphql,
      renderLoading: this.props.renderLoading,
    };
  }

  constructor(props, context) {
    super(props, context);
    this.state = { store: props.store };
  }

  componentWillReceiveProps(nextProps) {
    const { store } = this.state;
    const { store: nextStore } = nextProps;

    if (store !== nextStore) {
      const nextReducer = nextStore.getReducer();
      store.replaceReducer(nextReducer);
    }
  }

  render() {
    const { children } = this.props;
    return children();
  }
}
