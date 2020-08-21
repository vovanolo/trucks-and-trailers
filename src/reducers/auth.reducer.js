import { SET_AUTH_PENDING } from '../actionTypes';

function authPendingReducer(state = true, action) {
  switch (action.type) {
  case SET_AUTH_PENDING:
    state = action.payload;
    return state;

  default:
    return state;
  }
}

export default authPendingReducer;