/* @flow */

import React, { Component, PropTypes } from 'react';
import createStoreShape from '../store/createStoreShape';
import shallowEqual from '../utils/shallowEqual';

export default class GraphQLConnector extends Component {
  static contextTypes = {
    store: createStoreShape(PropTypes).isRequired,
    graphql: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired,
  }

  static propTypes = {
    children: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    query: PropTypes.func.isRequired,
    queryArgs: PropTypes.object.isRequired,
  }

  static defaultProps = {
    select: state => state,
  }

  constructor(props, context) {
    super(props, context);
    this.state = this.selectState(props, context);
  }

  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(this.handleChange.bind(this));
    this.handleChange();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.queryArgs !== this.props.queryArgs) {
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
    this.selectState(props, this.context)
      .then(nextState => {
        if (!this.isSliceEqual(this.state.slice, nextState.slice)) {
          this.setState(nextState);
        }
      })
      .catch(err => console.error(err));
  }

  selectState(props, context) {
    const state = context.store.getState();

    const { graphql, schema } = this.context;
    const { query, queryArgs } = props;

    return graphql(schema, query(queryArgs), state)
      .then(({ data: slice }) => ({ slice }));
  }

  render() {
    const { children } = this.props;
    const { slice } = this.state;
    const { dispatch } = this.context.store;

    return children({ dispatch, ...slice });
  }
}
