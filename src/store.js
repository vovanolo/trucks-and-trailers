import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducers';
import middlewares from './middlewares/';

export default function configureStore() {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  return createStore(rootReducer, composeEnhancers(
    applyMiddleware(...middlewares)
  ));
}
