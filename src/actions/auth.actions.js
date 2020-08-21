import { SET_AUTH_PENDING } from '../actionTypes';

export function setAuthPending(isPending) {
  return {
    type: SET_AUTH_PENDING,
    payload: isPending
  };
}