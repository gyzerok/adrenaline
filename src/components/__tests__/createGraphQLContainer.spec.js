import test from 'tape';
import React, { Component } from 'react';
import createGraphQLContainer from '../createGraphQLContainer';

test('createGraphQLContainer should return React.Component', assert => {
  class TestComponent {
    render() {
      return <div></div>;
    }
  }
  const decorated = createGraphQLContainer(TestComponent, {});

  assert.equal(decorated instanceof Component, true);

  assert.end();
});
