import test from 'tape';
import sinon from 'sinon';
import sinonAsPromised from 'sinon-as-promised';
import React, { Component, PropTypes } from 'react';
import createSmartComponent from '../createSmartComponent';
import sd from 'skin-deep';
import AdrenalineConnector from '../AdrenalineConnector';
import {isFunction, pick, extend} from 'lodash';

global.document = {}; // https://github.com/facebook/react/issues/4019

class LoadingComponent {
  render() {
    return <p>Loading</p>;
  }
}
class TestComponent {
  render() {
    return <div></div>;
  }
}

test('createSmartComponent', t=>{
    t.plan(9);

    let resolveQuery, rejectQuery;
    let context = {
        adrenaline: {
            performQuery: sinon.stub().returns(new Promise(()=>{})),
            performMutation: sinon.stub().returns(new Promise(()=>{})),
            selectState: sinon.stub().returns(new Promise(()=>{}))
        },
        store: {
            subscribe: sinon.stub(),
            dispatch: sinon.stub(),
            getState: sinon.stub()
        },
        Loading: LoadingComponent
    };

    const queryFn = function(){};
    const initialVariables = { foo: 'foo' };
    const SmartComponent = createSmartComponent(TestComponent, {
        initialVariables: initialVariables,
        query: queryFn
    });

    t.ok(Component.isPrototypeOf(SmartComponent), "should return React.Component");

    const tree = sd.shallowRender(
        <SmartComponent {...context}/>
    );
    t.ok(context.adrenaline.performQuery.calledWith(context.store, queryFn, initialVariables), "should set initialVariables in uncommitted state");

    t.equal(tree.getRenderOutput().type, LoadingComponent, "should render <Loading/> if the query has not been fetched");

    t.comment("- after resolving a query");

    context.adrenaline = extend(context.adrenaline, {
        performQuery: sinon.stub().resolves({query: 'foo', variables: {foo: 'bar'}}),
        selectState: sinon.stub().resolves({ blah: 'blah' })
    });
    const resolved = sd.shallowRender(
        <SmartComponent {...context} foo='foo' bar='bar' />
    );
    setTimeout(()=>{ // setState is async
        const component = resolved.getRenderOutput();
        t.notEqual(component.type, LoadingComponent, "should not render <Loading/>");
        t.equal(component.type, AdrenalineConnector, "should render the <AdrenalineConnector/> for managing child state");
        t.ok(isFunction(component.props.children), "should pass a state slice rendering function to render the decorated component as child of <AdrenalineConnector/>")
        const decoratedComponent = component.props.children({slice: 'slice'});
        t.equal(decoratedComponent.type, TestComponent, "should render the decorated component when invoked with a state slice");
        t.equal(decoratedComponent.props.slice, 'slice', "should pass the state slice as props to the decorated component");
        t.isEquivalent(pick(decoratedComponent.props, 'foo', 'bar'), {foo: 'foo', bar: 'bar'}, "should pass other props through to the decorated component");
    });

});
