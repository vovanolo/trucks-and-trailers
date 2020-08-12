import { LOGIN_USER, LOGOUT_USER } from '../actionTypes';

export function setUser(userInfo) {
  return {
    type: LOGIN_USER,
    payload: userInfo
  };
}

export function removeUser() {
  return {
    type: LOGOUT_USER
  };
}