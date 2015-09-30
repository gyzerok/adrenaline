/* @flow */

import React, { Component, PropTypes } from 'react';
import createStoreShape from '../store/createStoreShape';
import createAdaptorShape from '../adaptor/createAdaptorShape';
import shallowEqual from '../utils/shallowEqual';

export default class AdrenalineConnector extends Component {
  static contextTypes = {
    adrenaline: createStoreShape(PropTypes).isRequired,
    store: createStoreShape(PropTypes).isRequired
  }

  static propTypes = {
    children: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    query: PropTypes.string.isRequired,
    variables: PropTypes.object.isRequired,
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
    if (nextProps.variables !== this.props.variables) {
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
      .then(slice => {
        if (!this.isSliceEqual(this.state.slice, {slice})) {
          this.setState({slice});
        }
      })
      .catch(err => console.error(err));
  }

  selectState(props, context) {
    const { store, adrenaline } = context;
    const { query, variables } = this.props;
    return adrenaline.selectState(store, query, variables)
  }

  render() {
    const { children } = this.props;
    const { slice } = this.state;
    const { dispatch } = this.context.store;

    return children({ dispatch, ...slice });
  }
}
