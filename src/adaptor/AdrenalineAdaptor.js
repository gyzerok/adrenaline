import { UPDATE_CACHE } from '../constants';
import { createStore as createReduxStore } from 'redux';
import shallowEqual from '../utils/shallowEqual';

export default class AdrenalineAdaptor {

  /**
   * When passing an adaptor a store redux 'createStore' function, the adaptor
   * should invoke it with an appropriate reducer and initialState in order
   * to manage its cache.
   *
   * @param  {Function} createStore A redux 'createStore' function
   * @return {Object} A redux store
   */
  createCacheStore(createStore = createReduxStore) {
    return createStore();
  }

  /**
   * Determines if a state slice has changed. State selected from redux cache
   * may be composed of multiple sources, but this default behavior is to do
   * a shallow refernce equality check.
   * @param  {Object}  state     State selected previously by this adaptor
   * @param  {Object}  nextState Future state for a component selected by this
   *                             adaptor
   * @return {Boolean}           Whether the state has changed.
   */
  hasStateChanged(state, nextState){
    const isRefEqual = state === nextState;
    if (isRefEqual) {
      return true;
    } else if (typeof state !== 'object' || typeof nextState !== 'object') {
      return isRefEqual;
    }
    return !shallowEqual(state, nextState);
  }

  /**
   * Invoked by smart components as their query variables change. Function
   * should return a promise that resolves or rejects with {query, variables}.
   * Implementations need only ensure that the requirements of a query be
   * selectable from the redux store. If a query is already in the cache and
   * no request is needed, the promise can resolve immediately.
   *
   * @param {Object} store The redux store.
   * @param {Function|String} query The query definition.
   * @param {Object} The query variables to apply.
   * @return {Promise<{query, variables}>} [description]
   */
  performQuery() {}

  /**
   * Execute a mutation. Implementations are required to implement their own
   * cache updates if needed.
   * @param {Object} store The redux store.
   */
  performMutation() {
    // TODO, does this deserve a definition outside of GraphQL?
  }

  /**
   * Dispatch a cache update action on the store.
   * @param  {Object} store    The redux store.
   * @param  {Object} {payload, error} The payload and error to dispatch.
   */
  dispatchCacheUpdate(store, {payload, error}) {
    const { dispatch } = store;
    dispatch({
      type: UPDATE_CACHE,
      payload,
      error,
    });
  }

}
