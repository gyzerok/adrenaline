/* @flow */

import React, { Component, PropTypes, Children } from 'react';
import GraphQLAdaptor from '../adaptor/graphql/GraphQLAdaptor';
import Loading from './Loading';
import { createStore } from 'redux';
import createStoreShape from '../store/createStoreShape';
import createAdaptorShape from '../adaptor/createAdaptorShape';
import { UPDATE_CACHE } from '../constants';
import invariant from 'invariant';
import { isUndefined } from 'lodash';

const adaptorShape = createAdaptorShape(PropTypes);

export default class Adrenaline extends Component {
  static childContextTypes = {
    Loading: PropTypes.func.isRequired,
    store: createStoreShape(PropTypes).isRequired,
    adrenaline: adaptorShape.isRequired
  }

  static defaultProps = {
    renderLoading: Loading,
    createStore: createStore
  }

  static propTypes = {
    renderLoading: PropTypes.func,
    children: PropTypes.func.isRequired,
    endpoint: PropTypes.string,
    schema: PropTypes.object,
    adaptor: function(props, propName, componentName) {
        if(props[propName]){
            return adaptorShape(props, propName, componentName);
        } else {
            if(!props.schema){
                return new Error(propName + ' in ' + componentName + " is required if 'schema' is not specified.");
            }
            return null;
        }
    },
    createStore: PropTypes.func,
    store: createStoreShape(PropTypes)
  }

  getChildContext() {
    return {
      Loading: this.props.renderLoading,
      store: this.store,
      adrenaline: this.adaptor
    };
  }

  constructor(props, context) {
    super(props, context);

    // mutually exclusive.
    if(props.adaptor){
        this.adaptor = props.adaptor;
    } else {
        if(props.schema){
            this.adaptor = new GraphQLAdaptor(props.schema, props.endpoint);
        }
    }
    invariant(
        !isUndefined(this.adaptor) && this.adaptor !== null,
        "Adrenaline requires that you provide an adaptor or a GraphQL schema for which a default adaptor can be constructed."
    );

    if(this.props.store){
        this.store = props.store;
    } else {
        this.store = this.adaptor.createCacheStore(this.props.createStore);
    }
    invariant(
        !isUndefined(this.store) && this.store !== null,
        "Adrenaline requires a redux store."
    );
  }

  render() {
    const { children } = this.props;
    return children();
  }
}
