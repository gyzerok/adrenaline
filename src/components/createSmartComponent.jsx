/* @flow */

import React, { Component, PropTypes } from 'react';
import invariant from 'invariant';
import { mapValues, reduce, isFunction } from 'lodash';
import AdrenalineConnector from './AdrenalineConnector';
import shadowEqualScalar from '../utils/shadowEqualScalar';
import getDisplayName from '../utils/getDisplayName';
import createAdaptorShape from '../adaptor/createAdaptorShape';
import createStoreShape from '../store/createStoreShape';

export default function createSmartComponent(DecoratedComponent, specs) {
  const displayName = `SmartComponent(${getDisplayName(DecoratedComponent)})`;

  return class extends Component {
    static displayName = displayName
    static DecoratedComponent = DecoratedComponent

    static contextTypes = {
      Loading: PropTypes.func.isRequired,
      adrenaline: createAdaptorShape(PropTypes),
      store: createStoreShape(PropTypes),
    }

    constructor(props, context) {
      super(props, context);
      const initialArgs = specs.initialArgs || {};
      this.state = isFunction(initialArgs) ? initialArgs(props) : initialArgs;

      DecoratedComponent.prototype.setArgs = (nextArgs) => {
        this.setState(nextArgs, () => this.fetch());
      };


      this.mutations = mapValues(specs.mutations, m => {
        return (params, files) => {
            const { adrenaline, store } = this.context;
            adrenaline.performMutation(store, m, params, files);
        }
      });

      this.fetch();
    }

    /*shouldComponentUpdate(nextProps) {
      return !shadowEqualScalar(this.props, nextProps);
    }*/

    fetch(args = this.state) {
      const { adrenaline, store } = this.context;
      const { dispatch } = store;
      const { query } = specs;

      adrenaline.performQuery(dispatch, query, args);
    }

    renderDecoratedComponent(state) {
      invariant(
        DecoratedComponent.propTypes !== undefined,
        'You have to declare propTypes for %s',
        displayName,
      );

      const { propTypes } = DecoratedComponent;
      const requiredPropTypes = reduce(propTypes, (memo, val, key) => {
        if (!val.hasOwnProperty('isRequired')) {
          return [...memo, key];
        }
        return memo;
      }, []);
      const dataLoaded = requiredPropTypes.every(key => {
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
          args={this.state}
          mutations={this.mutations} />
      );
    }

    render() {
      return (
        <AdrenalineConnector query={specs.query} variables={this.state}>
          {this.renderDecoratedComponent.bind(this)}
        </AdrenalineConnector>
      );
    }
  };
}
