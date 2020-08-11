import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import feathers from 'feathers-client';
import io from 'socket.io-client';
import reduxifyServices, { getServicesStatus } from 'feathers-redux';
// import middlewares from './middleware';
import { createStore, applyMiddleware, combineReducers } from 'redux';
// import rootReducer from './reducers';
import reduxThunk from 'redux-thunk';
import reduxPromiseMiddleware from 'redux-promise-middleware';
import logger from 'redux-logger';

import './index.css';

import App from './App';

const socket = io('http://localhost:3030');
const client = feathers()
  .configure(feathers.socketio(socket))
  .configure(feathers.hooks());

const services = reduxifyServices(client, ['users', 'trucks', 'notes']);
const store = applyMiddleware(reduxThunk, logger, reduxPromiseMiddleware)(createStore)(combineReducers({
  users: services.users.reducer,
  trucks: services.trucks.reducer,
  notes: services.notes.reducer
}));
store.dispatch(services.notes.create({ text: 'tester' }));

ReactDOM.render(
  <Provider store={store}>
    <App services={services} getServicesStatus={getServicesStatus} />,
  </Provider>,
  document.getElementById('root')
);
