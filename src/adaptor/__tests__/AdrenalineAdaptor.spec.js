import test from 'tape';
import sinon from 'sinon';
import sinonAsPromised from 'sinon-as-promised';
import React, { Component, PropTypes } from 'react/addons';
import sd from 'skin-deep';
import AdrenalineAdaptor from '../AdrenalineAdaptor';
import {UPDATE_CACHE} from '../../constants';

test("AdrenalineAdaptor", t=>{
    const adaptor = new AdrenalineAdaptor();
    const store = {
        dispatch: sinon.stub()
    };
    const payload = 'payload';
    const error = 'error';

    adaptor.dispatchCacheUpdate(store, { payload, error });
    t.ok(store.dispatch.calledWith({
        type: UPDATE_CACHE,
        payload,
        error
    }), 'dispatchCacheUpdate - should dispatch cache update events to the store');
    t.end();
});
