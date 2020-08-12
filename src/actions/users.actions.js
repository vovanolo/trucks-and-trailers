import { LOGIN_USER } from '../actionTypes';

export function setUser(userInfo) {
  return {
    type: LOGIN_USER,
    payload: userInfo
  };
}