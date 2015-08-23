import describe from 'tape';
import React, { Component } from 'react';
import createSmartComponent from '../createSmartComponent';

describe('createSmartComponent should return React.Component', assert => {
  class TestComponent {
    render() {
      return <div></div>;
    }
  }
  const decorated = createSmartComponent(TestComponent, {});

  assert.equal(Component.isPrototypeOf(decorated), true);

  assert.end();
});
