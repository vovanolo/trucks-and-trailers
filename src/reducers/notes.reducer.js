import { SET_NOTES } from '../actionTypes';

function notesReducer(state = null, action) {
  switch (action.type) {
  case SET_NOTES:
    state = action.payload;
    return state;

  default:
    return state;
  }
}

export default notesReducer;