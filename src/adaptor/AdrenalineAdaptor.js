import { UPDATE_CACHE } from '../constants';
import { createStore as createReduxStore } from 'redux';

export default class AdrenalineAdaptor {

    /**
     * When passing an adaptor a store redux 'createStore' function, the adaptor
     * should invoke it with an appropriate reducer and initialState in order
     * to manage its cache.
     *
     * @param  {Function} createStore A redux 'createStore' function
     * @return {Object} A redux store
     */
    createCacheStore(createStore = createReduxStore){
        return createStore();
    }

    /**
     * Invoked by smart components as their query variables change. Function
     * should return a promise that resolves or rejects with {query, variables}.
     * Implementations need only ensure that the requirements of a query be
     * selectable from the redux store. If a query is already in the cache and
     * no request is needed, the promise can resolve immediately.
     *
     * @return {Promise<{query, variables}>} [description]
     */
    performQuery(store, query, variables){
        return Promise.resolve();
    }

    /**
     * Execute a mutation. Implementations are required to implement their own
     * cache updates if needed.
     */
    performMutation(store){
        // TODO, does this deserve a definition outside of GraphQL?
    }

    /**
     * Dispatch a cache update action on the store.
     * @param  {Object} store    The redux store.
     * @param  {Object} {payload, error} The payload and error to dispatch.
     */
    dispatchCacheUpdate(store, {payload, error}){
        const { dispatch } = store;
        store.dispatch({
            type: UPDATE_CACHE,
            payload,
            error
        });
    }

}
