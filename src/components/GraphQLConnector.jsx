/* @flow */

import React, { Component, PropTypes } from 'react';
import createStoreShape from '../utils/createStoreShape';
import shallowEqual from '../utils/shallowEqual';
import isPlainObject from '../utils/isPlainObject';
import { ACTION_TYPE } from '../constants';
import invariant from 'invariant';

export default class GraphQLConnector extends Component {
  static contextTypes = {
    store: createStoreShape(PropTypes).isRequired,
  }

  static propTypes = {
    chilren: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    endpoint: PropTypes.string.isRequired,
  }

  static defaultProps = {
    select: state => state,
    endpoint: '/graphql-endpoint',
  }

  getChildContext() {
    return {
      fetch: ::this.onFetch,
    };
  }

  constructor(props, context) {
    super(props, context);
    this.state = this.selectState(props, context);
  }

  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(::this.handleChange);
    this.handleChange();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.select !== this.props.select) {
      this.handleChange(nextProps);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !this.isSliceEqual(this.state.slice, nextState.slice) ||
           !shallowEqual(this.props, nextProps);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  isSliceEqual(slice, nextSlice) {
    const isRefEqual = slice === nextSlice;
    if (isRefEqual) {
      return true;
    } else if (typeof slice !== 'object' || typeof nextSlice !== 'object') {
      return isRefEqual;
    }
    return shallowEqual(slice, nextSlice);
  }

  handleChange(props = this.props) {
    const nextState = this.selectState(props, this.context);
    if (!this.isSliceEqual(this.state.slice, nextState.slice)) {
      this.setState(nextState);
    }
  }

  selectState(props, context) {
    const state = context.store.getState();
    const slice = {
      ...props.select(state),
      graphql: state.graphql,
    };

    invariant(
      isPlainObject(slice),
      'The return value of `select` prop must be an object. Instead received %s.',
      slice
    );

    return { slice };
  }

  onFetch(query: string) {
    if (!query.trim().length) return;

    const { dispatch } = this.context.store;
    const { endpoint } = this.props;
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
    const { children } = this.props;
    const { slice } = this.state;
    const { dispatch } = this.context.store;

    return children({ dispatch, ...slice });
  }
}
