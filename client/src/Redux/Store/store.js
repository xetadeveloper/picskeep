import { createStore, applyMiddleware, combineReducers } from 'redux';
import appReducer from '../Reducers/appReducer';

const rootReducer = combineReducers({
  app: appReducer,
});

const store = createStore(rootReducer);

console.log("Store's Startup State", store.getState());
store.subscribe(() => {
  console.log("Store's State", store.getState());
});

export default store;
