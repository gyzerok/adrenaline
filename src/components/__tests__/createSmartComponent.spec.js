import test from 'tape';
import React, { Component } from 'react';
import createDumbComponent from '../createDumbComponent';

test('createDumbComponent should return React.Component', assert => {
  class TestComponent {
    render() {
      return <div></div>;
    }
  }
  const decorated = createDumbComponent(TestComponent, {});

  assert.equal(Component.isPrototypeOf(decorated), true);

  assert.end();
});
