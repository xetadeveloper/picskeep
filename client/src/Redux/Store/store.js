import { createStore, applyMiddleware, combineReducers } from 'redux';
import httpMiddleware from '../Middleware/httpMiddleware';
import appReducer from '../Reducers/appReducer';
import flagReducer from '../Reducers/flagReducer';

const rootReducer = combineReducers({
  app: appReducer,
  flags: flagReducer,
});

const store = createStore(rootReducer, applyMiddleware(httpMiddleware));

console.log("Store's Startup State", store.getState());
store.subscribe(() => {
  console.log("Store's State", store.getState());
});

export default store;
