/* @flow */

import React from 'react';
import { Router } from 'react-router';
import { history } from 'react-router/lib/BrowserHistory';
import routes from './routes';
import { Adrenaline } from '../../../../src';
import schema from 'shared/schema';
import Loader from './components/Loader';
import Adaptor from './adaptor'

const rootNode = document.getElementById('root');
const adaptor = new Adaptor();

React.render(
  <Adrenaline adaptor={adaptor} renderLoading={Loader}>
    {() => <Router history={history} children={routes} />}
  </Adrenaline>,
  rootNode
);
