/* @flow */

import React, { Component, PropTypes } from 'react';
import invariant from 'invariant';
import GraphQLConnector from './GraphQLConnector';
import createStoreShape from '../utils/createStoreShape';
import shadowEqualScalar from '../utils/shadowEqualScalar';
import getDisplayName from '../utils/getDisplayName';
import normalize from '../utils/normalize';
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
    }

    static childContextTypes = {
      update: PropTypes.func.isRequired,
    }

    constructor(props, context) {
      super(props, context);
      this.pending = [];
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
      const { query } = specs;
      const { endpoint } = specs;
      const { store: { dispatch }, parsedSchema } = this.context;

      const request = query();
      if (this.pending.indexOf(request) > -1) return;
      this.pending = this.pending.concat(request);

      const opts = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: request }),
      };
      // TODO: Correct remove element from pending
      fetch(endpoint, opts)
        .then(res => res.json())
        .then(json => {
          dispatch({
            type: ACTION_TYPE,
            payload: normalize(parsedSchema, json.data),
          });
          this.pending = [];
        })
        .catch(err => {
          dispatch({ type: ACTION_TYPE, payload: err, error: true });
          this.pending = [];
        });
    }

    renderComponent({ cache = {}, ...stuff}) {
      invariant(
        DecoratedComponent.propTypes !== undefined,
        'You have to declare propTypes for %s',
        displayName,
      );

      const keys = Object.keys(DecoratedComponent.propTypes || {});
      const allProps = keys.every(key => {
        return cache.hasOwnProperty(key) && cache[key] !== null;
      });

      const { Loading } = this.context;
      if (!allProps) {
        return <Loading />;
      }

      return (
        <DecoratedComponent {...stuff} {...cache} {...this.props} />
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
