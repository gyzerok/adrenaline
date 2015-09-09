/* @flow */

import React, { Component, PropTypes } from 'react';
import invariant from 'invariant';
import Loading from './Loading';
import parseSchema from '../utils/parseSchema';
import createStoreShape from '../store/createStoreShape';
import createCacheSore from '../store/createCacheStore';
import request from '../network/request';
import normalize from '../utils/normalize';
import { UPDATE_CACHE } from '../constants';

export default class Adrenaline extends Component {
  static childContextTypes = {
    store: createStoreShape(PropTypes).isRequired,
    Loading: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired,
    performQuery: PropTypes.func.isRequired,
    performMutation: PropTypes.func.isRequired,
  };

  static propTypes = {
    children: PropTypes.func.isRequired,
    createStore: PropTypes.func,
    endpoint: PropTypes.string,
    renderLoading: PropTypes.func,
  }

  static defaultProps = {
    renderLoading: Loading,
    endpoint: '/graphql',
  }

  getChildContext() {
    return {
      store: this.store,
      Loading: this.props.renderLoading,
      schema: this.props.schema,
      performQuery: this.performQuery.bind(this),
      performMutation: this.performMutation.bind(this),
    };
  }

  constructor(props, context) {
    super(props, context);

    this.pendingQueries = [];
    this.pendingMutations = [];
    this.parsedSchema = parseSchema(props.schema);
    this.store = createCacheSore(this.parsedSchema, props.createStore);
  }

  performQuery(query, params) {
    if (this.pendingQueries.indexOf(query) > -1) return;
    this.pendingQueries = this.pendingQueries.concat(query);

    const { endpoint } = this.props;
    const { parsedSchema, store } = this;
    const { dispatch } = store;

    request(endpoint, { query, params })
      .then(json => {
        dispatch({
          type: UPDATE_CACHE,
          payload: normalize(parsedSchema, json.data),
        });
        this.pendingQueries = this.pendingQueries.filter(p => p === request);
      })
      .catch(err => {
        dispatch({ type: UPDATE_CACHE, payload: err, error: true });
        this.pendingQueries = this.pendingQueries.filter(p => p === request);
      });
  }

  performMutation({ mutation, updateCache = [] }, params, files) {
    invariant(
      mutation !== undefined && mutation !== null,
      'You have to declare "mutation" field in your mutation'
    );

    const { endpoint } = this.props;
    const { parsedSchema, store } = this;
    const { dispatch } = store;

    request(endpoint, { mutation, params }, files)
      .then(json => {
        const payload = normalize(parsedSchema, json.data);
        dispatch({ type: UPDATE_CACHE, payload });

        updateCache.forEach((fn) => {
          const { parentId, parentType, resolve } = fn(Object.values(json.data)[0]);
          const state = store.getState();
          const parent = state[parentType][parentId];
          if (!parent) return;
          dispatch({
            type: UPDATE_CACHE,
            payload: {
              [parentType]: {
                [parent.id]: resolve(parent),
              },
            },
          });
        });
      })
      .catch(err => {
        dispatch({ type: UPDATE_CACHE, payload: err, error: true });
      });
  }

  render() {
    const { children } = this.props;
    return children();
  }
}
