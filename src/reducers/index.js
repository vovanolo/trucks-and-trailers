import { combineReducers } from 'redux';
import usersReducer from './users.reducer';
import notesReducer from './notes.reducer';
import loadingReducer from './loading.reducer';

export default combineReducers({ usersReducer, notesReducer, loadingReducer });