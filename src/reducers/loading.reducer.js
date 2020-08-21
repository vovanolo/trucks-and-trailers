import { SET_LOADING } from '../actionTypes';

function loadingReducer(state = true, action) {
  switch (action.type) {
  case SET_LOADING:
    state = action.payload;
    return state;

  default:
    return state;
  }
}

export default loadingReducer;