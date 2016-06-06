import React, { Component, PropTypes } from 'react';
import invariant from 'invariant';

import getDisplayName from '../utils/getDisplayName';
import shallowEqual from '../utils/shallowEqual';


export default function container(specs) {
  return DecoratedComponent => {
    const displayName = `AdrenalineContainer(${getDisplayName(DecoratedComponent)})`;

    invariant(
      specs !== null && specs !== undefined,
      `${displayName} requires configuration.`
    );

    invariant(
      typeof specs.query === 'string',
      `You have to define 'query' as a string in ${displayName}.`
    );

    invariant(
      !specs.variables || typeof specs.variables === 'function',
      `You have to define 'variables' as a function in ${displayName}.`
    );

    function mapPropsToVariables(props) {
      return !!specs.variables ? specs.variables(props) : {};
    }

    return class extends Component {
      static displayName = displayName
      static DecoratedComponent = DecoratedComponent

      static contextTypes = {
        query: PropTypes.func,
        mutate: PropTypes.func,
      }

      static getSpecs() {
        return specs;
      }

      constructor(props, context) {
        super(props, context);

        this.state = {
          data: null,
          isFetching: true,
        };
      }

      componentWillMount() {
        this.query(this.props);
      }
      
      componentWillReceiveProps(nextProps){
        if (!shallowEqual(this.props, nextProps)) {
          this.query(nextProps);
        }
      }

      query = (props) => {
        const { query } = specs;
        const variables = mapPropsToVariables(props);

        this.setState({ isFetching: true }, () => {
          this.context.query(query, variables)
            .catch(err => {
              console.error(err); // eslint-disable-line
            })
            .then(data => this.setState({ data, isFetching: false }));
        });
      }

      mutate = ({ mutation = '', variables = {}, files = null, invalidate = true }) => {
        return this.context.mutate(mutation, variables, files)
          .then(() => {
            if (invalidate) {
              this.query();
            }
          });
      }

      render() {
        const { data, isFetching } = this.state;
        const variables = mapPropsToVariables(this.props);

        const dataOrDefault = isFetching ? {} : data;

        return (
          <DecoratedComponent
            {...this.props}
            {...dataOrDefault}
            isFetching={isFetching}
            mutate={this.mutate}
            variables={variables} />
        );
      }
    };
  };
}
