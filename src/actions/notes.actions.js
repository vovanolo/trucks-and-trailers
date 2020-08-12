import { SET_NOTES } from '../actionTypes';

export function setNotes(notes) {
  return {
    type: SET_NOTES,
    payload: notes
  };
}