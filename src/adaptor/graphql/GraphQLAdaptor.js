import AdrenalineAdaptor from '../AdrenalineAdaptor';
import parseSchema from './parseSchema';
import invariant from 'invariant';
import request from './request';
import normalize from './normalize';
import createCacheStore from './createCacheStore';
import { graphql } from 'graphql';

export default class GraphQLAdaptor extends AdrenalineAdaptor {

  constructor(schema, endpoint='/graphql') {
    super();
    this.schema = schema;
    this.endpoint = endpoint;
    this.parsedSchema = parseSchema(schema);
  }

  createCacheStore(createStore) {
    return super.createCacheStore(()=> {
      return createCacheStore(this.parsedSchema, createStore);
    });
  }

  selectState(store, query, variables) {
    const state = store.getState();
    const schema = this.schema;
    return graphql(schema, query, state, variables)
      .then(({ data }) => data);
  }

  performQuery(store, query, variables) {
    const { endpoint, parsedSchema } = this;

    return new Promise((resolve, reject)=> {
      return request(endpoint, { query, variables })
        .then(json => {
          this.dispatchCacheUpdate(store, {
            payload: normalize(parsedSchema, json.data),
          });
          resolve({ query, variables });
        })
        .catch(err => {
          this.dispatchCacheUpdate(store, {
            payload: err,
            error: true,
          });
          reject({ query, variables });
        });
    });
  }

  performMutation(store, { mutation, updateCache = [] }, params, files) {
    invariant(
      mutation !== undefined && mutation !== null,
      'You have to declare "mutation" field in your mutation'
    );

    const { endpoint, parsedSchema } = this;

    request(endpoint, { mutation, params }, files)
      .then(json => {
        const payload = normalize(parsedSchema, json.data);
        this.dispatchCacheUpdate(store, { payload });

        updateCache.forEach((fn) => {
          const { parentId, parentType, resolve } = fn(Object.values(json.data)[0]);
          const state = store.getState();
          const parent = state[parentType][parentId];
          if (!parent) return;
          this.dispatchCacheUpdate(store, {
            payload: {
              [parentType]: {
                [parent.id]: resolve(parent),
              },
            },
          });
        });
      })
      .catch(err => {
        this.dispatchCacheUpdate(store, { payload: err, error: true });
      });
  }
}
