import AdrenalineAdaptor from '../AdrenalineAdaptor';
import parseSchema from './parseSchema';
import invariant from 'invariant';
import request from './request';
import { createStore, combineReducers } from 'redux';
import merge from '../../utils/merge';
import { UPDATE_CACHE } from '../../constants';
import normalize from './normalize';
import createCacheStore from './createCacheStore';
import { graphql } from 'graphql';

export default class GraphQLAdaptor  extends AdrenalineAdaptor {
    constructor(schema, endpoint='/graphql') {
        super()
        this.schema = schema;
        this.endpoint = endpoint;
        this.parsedSchema = parseSchema(schema);
    }

    createCacheStore(composedStore){
        return createCacheStore(this.parsedSchema, composedStore)
    }

    selectState(store, query, variables) {
      const state = store.getState();
      const schema = this.schema;
      return graphql(schema, query, state, variables)
        .then(({ data }) => data);
    }

    performQuery(dispatch, query, params){
        const { endpoint, parsedSchema } = this;

        request(endpoint, { query, params })
          .then(json => {
            dispatch({
              type: UPDATE_CACHE,
              payload: normalize(parsedSchema, json.data),
            });
          })
          .catch(err => {
            dispatch({ type: UPDATE_CACHE, payload: err, error: true });
          });
    }

    // TODO
    performMutation(store, { mutation, updateCache = [] }, params, files){
        invariant(
          mutation !== undefined && mutation !== null,
          'You have to declare "mutation" field in your mutation'
        );

        const { endpoint, parsedSchema } = this;
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
}
