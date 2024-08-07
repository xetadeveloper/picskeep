import { legacy_createStore, applyMiddleware, combineReducers } from 'redux';
import httpMiddleware from '../Middleware/httpMiddleware';
import s3Middleware from '../Middleware/s3Middleware';
import appReducer from '../Reducers/appReducer';
import flagReducer from '../Reducers/flagReducer';

const rootReducer = combineReducers({
  app: appReducer,
  flags: flagReducer,
});

const store = legacy_createStore(
  rootReducer,
  applyMiddleware(httpMiddleware, s3Middleware)
);

// console.log("Store's Startup State", store.getState());
store.subscribe(() => {
  // console.log("Store's State", store.getState());
});

export default store;
