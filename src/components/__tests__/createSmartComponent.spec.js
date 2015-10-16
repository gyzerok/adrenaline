import test from 'tape';
import sinon from 'sinon';
import sinonAsPromised from 'sinon-as-promised';
import React, { Component, PropTypes } from 'react';
import createSmartComponent from '../createSmartComponent';
import sd from 'skin-deep';
import AdrenalineConnector from '../AdrenalineConnector';
import {isFunction, pick, extend, merge, methods} from 'lodash';

global.document = {}; // https://github.com/facebook/react/issues/4019

class LoadingComponent extends Component {
  render() {
    return <p>Loading</p>;
  }
}
class TestComponent extends Component {
  render() {
    return <div></div>;
  }
}

function isolatedTest(options, fn){
    let defaultContext = {
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
    const SmartComponent = createSmartComponent(TestComponent, options);
    return fn({context:defaultContext, SmartComponent, options});
}

test('createSmartComponent', t=>{
    t.plan(12);

    isolatedTest({query: sinon.stub(), initialVariables: {foo: 'foo'}},
        ({context, options, SmartComponent})=>{
            t.ok(Component.isPrototypeOf(SmartComponent), "should return React.Component");
        }
    )

    isolatedTest({query: sinon.stub(), initialVariables: {foo: 'foo'}},
        ({context, options, SmartComponent})=>{
            const {query, initialVariables} = options;
            const tree = sd.shallowRender(
                <SmartComponent {...context}/>
            );
            t.ok(context.adrenaline.performQuery.calledWith(context.store, query, initialVariables), "should set initialVariables in uncommitted state");
            t.equal(tree.getRenderOutput().type, LoadingComponent, "should render <Loading/> if the query has not been fetched");
            t.ok(Component.isPrototypeOf(SmartComponent), "should return React.Component");
        }
    )

    isolatedTest({query: sinon.stub(), initialVariables: {foo: 'foo'}},
        ({context, options, SmartComponent})=>{
            context.adrenaline = extend(context.adrenaline, {
                performQuery: sinon.stub().resolves({query: 'foo', variables: {foo: 'bar'}}),
                selectState: sinon.stub().resolves({ blah: 'blah' })
            });
            const resolved = sd.shallowRender(
                <SmartComponent {...context} foo='foo' bar='bar' />
            );
            setTimeout(()=>{ // setState is async
                t.comment("- after resolving a query");
                const component = resolved.getRenderOutput();
                t.notEqual(component.type, LoadingComponent, "should not render <Loading/>");
                t.equal(component.type, AdrenalineConnector, "should render the <AdrenalineConnector/> for managing child state");
                t.ok(isFunction(component.props.children), "should pass a state slice rendering function to render the decorated component as child of <AdrenalineConnector/>")
                const decoratedComponent = component.props.children({slice: 'slice'});
                t.equal(decoratedComponent.type, TestComponent, "should render the decorated component when invoked with a state slice");
                t.equal(decoratedComponent.props.slice, 'slice', "should pass the state slice as props to the decorated component");
                t.isEquivalent(pick(decoratedComponent.props, 'foo', 'bar'), {foo: 'foo', bar: 'bar'}, "should pass other props through to the decorated component");
            });
        }
    );

    isolatedTest({query: sinon.stub(), variables: (props)=>{ return {call: props.call }}},
        ({context, options, SmartComponent})=>{
            context.adrenaline = extend(context.adrenaline, {
                performQuery: (store, query, variables)=> Promise.resolve({query, variables}),
                selectState: (store, query, {call}) => Promise.resolve({call})
            });
            const props = {
                call: 1
            };
            const tree = sd.shallowRender(<SmartComponent {...context} {...props} />);

            setTimeout(()=>{
                t.comment("- using 'variables' as a pure function of props");
                let adrenalineConnector = tree.getRenderOutput();
                t.isEquivalent(adrenalineConnector.props.variables, {call:1}, "should set variables to the passed props");
                props.call = 2;
                tree.reRender(<SmartComponent {...context} {...props} />);
                setTimeout(()=>{
                    adrenalineConnector = tree.getRenderOutput();
                    t.isEquivalent(adrenalineConnector.props.variables, {call:2}, "should update variables when the props change");
                });
            });
        }
    );
});
