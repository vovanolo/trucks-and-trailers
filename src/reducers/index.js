import { combineReducers } from 'redux';
import usersReducer from './users.reducer';
import notesReducer from './notes.reducer';
import authReducer from './auth.reducer';

export default combineReducers({ usersReducer, notesReducer, authReducer });