/* @flow */

import React, { Component, PropTypes } from 'react';
import Loading from './Loading';
import createStoreShape from '../utils/createStoreShape';
import parseSchema from '../utils/parseSchema';
import createCache from '../utils/createCache';

export default class Adrenaline extends Component {
  static childContextTypes = {
    store: createStoreShape(PropTypes).isRequired,
    graphql: PropTypes.func.isRequired,
    Loading: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired,
    parsedSchema: PropTypes.object.isRequired,
    endpoint: PropTypes.string.isRequired,
  };

  static propTypes = {
    children: PropTypes.func.isRequired,
    graphql: PropTypes.func.isRequired,
    endpoint: PropTypes.string,
    renderLoading: PropTypes.func,
  }

  static defaultProps = {
    renderLoading: Loading,
    endpoint: '/graphql',
  }

  getChildContext() {
    const parsedSchema = parseSchema(this.props.schema);
    return {
      store: createCache(parsedSchema),
      graphql: this.props.graphql,
      Loading: this.props.renderLoading,
      schema: this.props.schema,
      parsedSchema: parsedSchema,
      endpoint: this.props.endpoint,
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
