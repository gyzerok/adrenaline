/* @flow */

import React, { Component, PropTypes } from 'react/addons';
import invariant from 'invariant';
import { mapValues, reduce, isFunction } from 'lodash';
import AdrenalineConnector from './AdrenalineConnector';
import shadowEqualScalar from '../utils/shadowEqualScalar';
import getDisplayName from '../utils/getDisplayName';
import createAdaptorShape from '../adaptor/createAdaptorShape';
import createStoreShape from '../store/createStoreShape';
import { extend, isUndefined } from 'lodash';

export default function createSmartComponent(DecoratedComponent, specs) {
  const displayName = `SmartComponent(${getDisplayName(DecoratedComponent)})`;

  return class extends Component {
    static displayName = displayName
    static DecoratedComponent = DecoratedComponent

    static contextTypes = {
      Loading: PropTypes.func.isRequired,
      adrenaline: createAdaptorShape(PropTypes).isRequired,
      store: createStoreShape(PropTypes).isRequired,
    }

    static childContextTypes = {
      Loading: PropTypes.func.isRequired,
      adrenaline: PropTypes.object.isRequired,
      store: createStoreShape(PropTypes).isRequired
    }

    constructor(props, context) {
      super(props, context);

      const initialVariables = specs.initialVariables || specs.initialArgs || {};
      this.state = {
          uncommittedVariables: isFunction(initialVariables) ? initialVariables(props) : initialVariables
      };

      DecoratedComponent.prototype.setVariables = (nextVariables) => {
        const uncommittedVariables = extend(this.state.uncommittedVariables, nextVariables);
        this.setState({ uncommittedVariables }, () => this.fetch());
      };

      this.mutations = mapValues(specs.mutations, m => {
        return (params, files) => {
            const { adrenaline, store } = this.context;
            adrenaline.performMutation(store, m, params, files);
        }
      });
    }

    componentWillMount(){
        this.fetch();
    }

    /*shouldComponentUpdate(nextProps) {
      return !shadowEqualScalar(this.props, nextProps);
    }*/

    fetch() {
      const variables = this.state.uncommittedVariables;
      const { adrenaline, store } = this.context;
      const { query } = specs;
      adrenaline.performQuery(store, query, variables)
        .then(({query, variables})=>{
          // commit the newly loaded variables
          this.setState({ variables: variables || null });
        })
        .catch((query, variables)=>{
          console.error('Query failed with variables', query, variables);
        });
    }

    renderDecoratedComponent(slice){
      return (
        <DecoratedComponent {...this.props} {...slice}
          adrenaline={this.state}
          mutations={this.mutations} />
      )
    }

    render() {
      const dataLoaded = !isUndefined(this.state.variables);
      if (!dataLoaded) {
        const { Loading } = this.context;
        return <Loading />;
      }
      const { store, adrenaline } = this.context;
      return (
        <AdrenalineConnector
            store={store}
            adrenaline={adrenaline}
            query={specs.query}
            variables={this.state.variables}>
          {this.renderDecoratedComponent.bind(this)}
        </AdrenalineConnector>
      );
    }
  };
}
