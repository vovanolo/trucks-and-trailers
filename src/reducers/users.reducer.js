import { LOGIN_USER, LOGOUT_USER } from '../actionTypes';

function usersReducer(state = null, action) {
  switch (action.type) {
  case LOGIN_USER:
    state = action.payload;
    return state;
  case LOGOUT_USER:
    state = null;
    return state;

  default:
    return state;
  }
}

export default usersReducer;