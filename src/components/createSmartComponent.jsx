/* @flow */

import React, { Component, PropTypes } from 'react';
import GraphQLConnector from './GraphQLConnector';
import createStoreShape from '../utils/createStoreShape';
import shadowEqualScalar from '../utils/shadowEqualScalar';
import getDisplayName from '../utils/getDisplayName';
import { ACTION_TYPE } from '../constants';

export default function createSmartComponent(DecoratedComponent, specs) {
  const displayName = `SmartComponent(${getDisplayName(DecoratedComponent)})`;

  return class extends Component {
    static displayName = displayName
    static DecoratedComponent = DecoratedComponent

    static contextTypes = {
      store: createStoreShape(PropTypes).isRequired,
    }

    static childContextTypes = {
      update: PropTypes.func.isRequired,
    }

    constructor(props, context) {
      super(props, context);
      this.pending = null;
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
      const { dispatch } = this.context.store;

      const request = query();
      if (request === this.pending) return;
      this.pending = request;
      console.log(request);

      const opts = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: request }),
      };
      // TODO: Somehow deal with errors
      fetch(endpoint, opts)
        .then(res => res.json())
        .then(json => {
          dispatch({ type: ACTION_TYPE, payload: json.data });
          this.pending = null;
        })
        .catch(err => {
          dispatch({ type: ACTION_TYPE, payload: err, error: true });
          this.pending = null;
        });
    }

    render() {
      return (
        <GraphQLConnector select={state => state}>
          {stuff => <DecoratedComponent {...stuff} {...this.props} />}
        </GraphQLConnector>
      );
    }
  };
}
