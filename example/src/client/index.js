/* @flow */

import 'whatwg-fetch';
import React from 'react';
import App from 'client/components/App';
import { Adrenaline } from '../../../src';
import { graphql } from 'graphql';
import schema from 'shared/schema';

const rootNode = document.getElementById('root');
React.render(
  <Adrenaline graphql={graphql} schema={schema}>
    {() => <App />}
  </Adrenaline>,
  rootNode
);
