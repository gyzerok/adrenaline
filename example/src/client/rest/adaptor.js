import 'whatwg-fetch';
import AdrenalineAdaptor from '../../../../src/adaptor/AdrenalineAdaptor';
import { UPDATE_CACHE } from '../../../../src/constants';
import { reduce, pairs, extend, map } from 'lodash';
import { createStore, combineReducers } from 'redux';

function queryParams( obj ) {
  return '?'+Object.keys(obj).reduce(function(a,k){a.push(k+'='+encodeURIComponent(obj[k]));return a},[]).join('&')
}

function rootReducer(state, action){
    if(action.type === UPDATE_CACHE){
        const {type, data} = action.payload;
        return extend(state, {
            [type]: data
        });
    }
    return state;
}

export default class Adaptor extends AdrenalineAdaptor {

    createCacheStore(){
        return createStore(rootReducer, {});
    }

    selectState(store, query, variables){
        const state = store.getState();
        const resolvedRequirements = query(variables);
        const selectedState = reduce(resolvedRequirements, (result, params, type)=>{
            result[type] = state[type];
            return result;
        }, {});
        return Promise.resolve(selectedState);
    }

    performQuery(store, query, variables){
        const resolvedRequirements = query(variables)
        const queries = map(pairs(resolvedRequirements), ([type, params])=>{
            const queryString = Object.keys(params).reduce(function(a,k){a.push(k+'='+encodeURIComponent(params[k]));return a},[]).join('&');
            const url = `/rest/${type}?${queryString}`;
            return fetch(url).then((response)=>response.json()).then((json)=>{
                this.dispatchCacheUpdate(store, {
                    payload: {
                        type,
                        data: json
                    }
                });
            });
        })
        return Promise.all(queries).then(()=>{
            return {query, variables};
        });
    }
}
