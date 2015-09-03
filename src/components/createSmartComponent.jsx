/* @flow */

import React, { Component, PropTypes } from 'react';
import invariant from 'invariant';
import GraphQLConnector from './GraphQLConnector';
import createStoreShape from '../utils/createStoreShape';
import shadowEqualScalar from '../utils/shadowEqualScalar';
import getDisplayName from '../utils/getDisplayName';

export default function createSmartComponent(DecoratedComponent, specs) {
  const displayName = `SmartComponent(${getDisplayName(DecoratedComponent)})`;

  return class extends Component {
    static displayName = displayName
    static DecoratedComponent = DecoratedComponent

    static contextTypes = {
      store: createStoreShape(PropTypes).isRequired,
      Loading: PropTypes.func.isRequired,
      performQuery: PropTypes.func.isRequired,
    }

    static childContextTypes = {
      update: PropTypes.func.isRequired,
    }

    constructor(props, context) {
      super(props, context);
      this.pending = [];
      this.mutations = {}
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
      this.context.performQuery(specs.query());
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
