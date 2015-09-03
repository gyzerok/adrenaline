/* @flow */

import 'whatwg-fetch';
import React from 'react';
import { Router } from 'react-router';
import { history } from 'react-router/lib/BrowserHistory';
import routes from './routes';
import { Adrenaline } from '../../../src';
import { graphql } from 'graphql';
import schema from 'shared/schema';

const rootNode = document.getElementById('root');
React.render(
  <Adrenaline graphql={graphql} schema={schema} endpoint="/graphql">
    {() => <Router history={history} children={routes} />}
  </Adrenaline>,
  rootNode
);
