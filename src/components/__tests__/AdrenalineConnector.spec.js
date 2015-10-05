import test from 'tape';
import sinon from 'sinon';
import sinonAsPromised from 'sinon-as-promised';
import React, { Component, PropTypes } from 'react/addons';
import sd from 'skin-deep';
import AdrenalineConnector from '../AdrenalineConnector';

function isolatedTest(fn){
    let props = {
      adrenaline: {
          selectState: sinon.stub().returns(new Promise(()=>{})),
          performQuery: ()=>{},
          performMutation: ()=>{}
      },
      store: {
          subscribe: sinon.stub(),
          dispatch: ()=>{},
          getState: ()=>{}
      },
      query: 'theQuery',
      variables: {
          foo: 'bar'
      }
    }
    const childRenderStub = sinon.stub().returns(<p>Child</p>);
    const unsubscribeStub = sinon.stub();
    props.store.subscribe.returns(unsubscribeStub);

    return fn({props, childRenderStub, unsubscribeStub});
}

test('AdrenalineConnector', t=>{
    t.plan(3);

    isolatedTest(({props, childRenderStub, unsubscribeStub})=>{
        const tree = sd.shallowRender(
            <AdrenalineConnector {...props}>{childRenderStub}</AdrenalineConnector>
        );
        setTimeout(()=>{
            t.notOk(childRenderStub.called, "should not render child before a state slice is made available asynchronously");
        });
    });

    isolatedTest(({props, childRenderStub, unsubscribeStub})=>{
        props.adrenaline.selectState = sinon.stub().resolves({slice: 'slice'});
        const tree = sd.shallowRender(
            <AdrenalineConnector {...props}>{childRenderStub}</AdrenalineConnector>
        );

        setTimeout(()=>{
            t.ok(childRenderStub.calledWith({slice:'slice'}), "should render child with the resolved state slice ");

            props.adrenaline.selectState.resolves({secondSlice: 'secondSlice'});
            props.store.subscribe.getCall(0).args[0]();
            setTimeout(()=>{
                t.ok(childRenderStub.calledWith({secondSlice: 'secondSlice'}), "should subscribe to store changes and render the child with an updated state slice");
            });
        });

    });

})
