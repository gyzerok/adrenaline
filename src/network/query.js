/* @flow */

export default function sendQuery(query) {
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
