/* @flow */

import React, { Component } from 'react';
import GraphQLConnector from './GraphQLConnector';
import getDisplayName from '../utils/getDisplayName';
import shadowEqualScalar from '../utils/shadowEqualScalar';

export default function connectorDecorator(select) {
  return DecoratedComponent => class extends Component {
    static displayName = `GraphQLConnector(${getDisplayName(DecoratedComponent)})`;
    static DecoratedComponent = DecoratedComponent;

    shouldComponentUpdate(nextProps) {
      return !shadowEqualScalar(this.props, nextProps);
    }

    render() {
      return (
        <GraphQLConnector select={state => select(state, this.props)}>
          {stuff => <DecoratedComponent {...stuff} {...this.props} />}
        </GraphQLConnector>
      );
    }
  };
}
