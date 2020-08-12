import { LOGIN_USER } from '../actionTypes';

function usersReducer(state = null, action) {
  switch (action.type) {
  case LOGIN_USER:
    state = action.payload;
    return state;

  default:
    return state;
  }
}

export default usersReducer;