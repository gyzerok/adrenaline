import test from 'tape';
import React, { Component } from 'react';
import createGraphQLDecorator from '../createGraphQLDecorator';

test('createGraphQLDecorator should return React.Component', { skip: true }, assert => {
  class TestComponent {
    render() {
      return <div></div>;
    }
  }
  const decorated = createGraphQLDecorator(x => x)(TestComponent);

  assert.equal(decorated instanceof Component, true);

  assert.end();
});
