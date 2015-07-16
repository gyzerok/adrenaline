/* @flow */

export function createReducer() {
  return (state = {}, action) => {
    switch (action.type) {
      case ACTION_TYPE:
        return {
          ...state,
          ...action.payload,
        };
      default:
        return state;
    }
  };
}
