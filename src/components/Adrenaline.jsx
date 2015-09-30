/* @flow */

import React, { Component, PropTypes, Children } from 'react';
import invariant from 'invariant';
import Loading from './Loading';
import GraphQLAdaptor from '../adaptor/graphql/GraphQLAdaptor';
import createStoreShape from '../store/createStoreShape';
import { UPDATE_CACHE } from '../constants';

export default class Adrenaline extends Component {
  static childContextTypes = {
    store: createStoreShape(PropTypes).isRequired,
    adrenaline: PropTypes.object.isRequired,
    Loading: PropTypes.func.isRequired
  };

  static propTypes = {
    children: PropTypes.func.isRequired,
    createStore: PropTypes.func,
    endpoint: PropTypes.string,
    renderLoading: PropTypes.func,
    schema: PropTypes.object,
    adaptor: PropTypes.object,
    customProp: function(props, propName, componentName) {
        // TODO require either graphql defaults or adaptor
    //   if (!/matchme/.test(props[propName])) {
    //     return new Error('Validation failed!');
    //   }
    }
  }

  static defaultProps = {
    renderLoading: Loading
  }

  getChildContext() {
    return {
      store: this.store,
      adrenaline: this.adaptor,
      Loading: this.props.renderLoading
    };
  }

  constructor(props, context) {
    super(props, context);
    if(props.schema){
        this.adaptor = new GraphQLAdaptor(props.schema, props.endpoint);
    }
    // mutually exclusive.
    if(props.adaptor){
        this.adaptor = adaptor;
    }
    this.store = this.adaptor.createCacheStore(this.props.createStore);
    console.log('store', this.store);
  }

  render() {
    const { children } = this.props;
    return children();
  }
}
