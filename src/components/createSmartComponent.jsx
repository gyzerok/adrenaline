/* @flow */

import React, { Component, PropTypes } from 'react';
import invariant from 'invariant';
import GraphQLConnector from './GraphQLConnector';
import createStoreShape from '../utils/createStoreShape';
import shadowEqualScalar from '../utils/shadowEqualScalar';
import getDisplayName from '../utils/getDisplayName';
import normalize from '../utils/normalize';
import request from '../utils/request';
import bindMutations from '../utils/bindMutations';
import { ACTION_TYPE } from '../constants';

export default function createSmartComponent(DecoratedComponent, specs) {
  const displayName = `SmartComponent(${getDisplayName(DecoratedComponent)})`;

  return class extends Component {
    static displayName = displayName
    static DecoratedComponent = DecoratedComponent

    static contextTypes = {
      store: createStoreShape(PropTypes).isRequired,
      parsedSchema: PropTypes.object.isRequired,
      Loading: PropTypes.func.isRequired,
      endpoint: PropTypes.string.isRequired,
    }

    static childContextTypes = {
      update: PropTypes.func.isRequired,
    }

    constructor(props, context) {
      super(props, context);
      this.pending = [];
      this.mutations = bindMutations(
        context.endpoint,
        context.parsedSchema,
        specs.mutations || {},
        context.store.dispatch
      );
      this.onChildNeedUpdate();
    }

    getChildContext() {
      return {
        update: this.onChildNeedUpdate.bind(this),
      };
    }

    shouldComponentUpdate(nextProps) {
      return !shadowEqualScalar(this.props, nextProps);
    }

    onChildNeedUpdate() {
      const { parsedSchema, endpoint, store } = this.context;
      const { dispatch } = store;

      const query = specs.query();
      if (this.pending.indexOf(query) > -1) return;
      this.pending = this.pending.concat(query);

      request(endpoint, { query })
        .then(json => {
          dispatch({
            type: ACTION_TYPE,
            payload: normalize(parsedSchema, json.data),
          });
          this.pending = this.pending.filter(p => p === request);
        })
        .catch(err => {
          dispatch({ type: ACTION_TYPE, payload: err, error: true });
          this.pending = this.pending.filter(p => p === request);
        });
    }

    renderComponent(state) {
      invariant(
        DecoratedComponent.propTypes !== undefined,
        'You have to declare propTypes for %s',
        displayName,
      );

      const keys = Object.keys(DecoratedComponent.propTypes || {});
      const dataLoaded = keys.every(key => {
        if (key === 'mutations') {
          return true;
        }
        return state.hasOwnProperty(key) && state[key] !== null;
      });

      const { Loading } = this.context;
      if (!dataLoaded) {
        return <Loading />;
      }

      return (
        <DecoratedComponent {...this.props} {...state}
          mutations={this.mutations} />
      );
    }

    render() {
      return (
        <GraphQLConnector select={state => state} query={specs.query}>
          {this.renderComponent.bind(this)}
        </GraphQLConnector>
      );
    }
  };
}
