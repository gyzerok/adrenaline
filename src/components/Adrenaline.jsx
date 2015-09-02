/* @flow */

import React, { Component, PropTypes } from 'react';
import invariant from 'invariant';
import Loading from './Loading';
import createStoreShape from '../utils/createStoreShape';
import parseSchema from '../utils/parseSchema';
import createCache from '../utils/createCache';
import request from '../utils/request';
import normalize from '../utils/normalize';
import { UPDATE_CACHE, UPDATE_CACHE_BY_ID } from './contants';

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
    middlewares: PropTypes.array,
    graphql: PropTypes.func.isRequired,
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
      graphql: this.props.graphql,
      Loading: this.props.renderLoading,
      schema: this.props.schema,
      parsedSchema: this.parsedSchema,
      endpoint: this.props.endpoint,
    };
  }

  constructor(props, context) {
    super(props, context);

    this.pendingQueries = [];
    this.pendingMutations = [];
    this.parsedSchema = parseSchema(props.schema);
    this.store = createCache(this.parsedSchema, props.middlewares);
  }

  performQuery(query) {
    if (this.pendingQueries.indexOf(query) > -1) return;
    this.pendingQueries = this.pendingQueries.concat(query);

    const { endpoint } = this.props;
    const { parsedSchema, store } = this;
    const { dispatch } = store;

    request(endpoint, { query })
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

  performMutation({ mutation, updateCache = [] }, ...args) {
    invariant(
      mutation !== undefined && mutation !== null,
      'You have to declare "mutation" field in your mutation'
    );

    const { endpoint } = this.props;
    const { parsedSchema, store } = this;
    const { dispatch } = store;

    request(endpoint, { query: mutation(...args) })
      .then(json => {
        const payload = normalize(parsedSchema, json.data);
        dispatch({ type: UPDATE_CACHE, payload });

        const state = store.getState();
        updateCache.forEach(({ parentId, parentName, resolve }) => {
          const parent = state[parentName][parentId];
          if (!parent) return;
          dispatch({
            type: UPDATE_CACHE_BY_ID,
            payload: resolve(parent),
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
