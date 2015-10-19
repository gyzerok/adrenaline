/* @flow */

import React, { Component, PropTypes } from 'react/addons';
import createStoreShape from '../store/createStoreShape';
import createAdaptorShape from '../adaptor/createAdaptorShape';
import shallowEqual from '../utils/shallowEqual';

export default class AdrenalineConnector extends Component {

  static propTypes = {
    adrenaline: createAdaptorShape(PropTypes).isRequired,
    store: createStoreShape(PropTypes).isRequired,
    children: PropTypes.func.isRequired,
    query: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.func.isRequired
    ]),
    variables: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { store } = this.props;
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
    this.selectState(props)
      .then(slice => {
        if (!this.isSliceEqual(this.state.slice, {slice})) {
          this.setState({slice});
        }
      });
  }

  selectState(props) {
    const { store, adrenaline, query, variables } = props;
    return adrenaline.selectState(store, query, variables)
        .then(stateProps =>({
            variables: variables,
            props: stateProps
        }));
  }

  render() {
    const { children } = this.props;
    const { slice } = this.state;
    if(!slice){
        return null;
    }
    return children(slice);
  }
}
