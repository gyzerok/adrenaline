/* @flow */

import React, { Component, PropTypes } from 'react';
import Loading from './Loading';
import createStoreShape from '../utils/createStoreShape';
import parseSchema from '../utils/parseSchema';
import createCache from '../utils/createCache';

export default class Adrenaline extends Component {
  static childContextTypes = {
    store: createStoreShape(PropTypes).isRequired,
    graphql: PropTypes.func.isRequired,
    Loading: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired,
    parsedSchema: PropTypes.object.isRequired,
    endpoint: PropTypes.string.isRequired,
  };

  static propTypes = {
    children: PropTypes.func.isRequired,
    graphql: PropTypes.func.isRequired,
    endpoint: PropTypes.string,
    renderLoading: PropTypes.func,
  }

  static defaultProps = {
    renderLoading: Loading,
    endpoint: '/graphql',
  }

  getChildContext() {
    return {
      store: this.store,
      graphql: this.props.graphql,
      Loading: this.props.renderLoading,
      schema: this.props.schema,
      parsedSchema: this.parsedSchema,
      endpoint: this.props.endpoint,
    };
  }

  constructor(props, context) {
    super(props, context);
    this.parsedSchema = parseSchema(props.schema);
    this.store = createCache(this.parsedSchema);
  }

  render() {
    const { children } = this.props;
    return children();
  }
}
