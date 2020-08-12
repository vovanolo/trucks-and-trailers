import { combineReducers } from 'redux';
import usersReducer from './users.reducer';
import notesReducer from './notes.reducer';

export default combineReducers({ usersReducer, notesReducer });