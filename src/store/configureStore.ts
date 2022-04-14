import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import reducer from './rootReducer';

/**
 * The entry point to our store
 * getDefaultMiddleware : This returns an array of default middlewares like Thunk (used for async calls)
 */
const middlewares = [...getDefaultMiddleware()];
if (__DEV__) {
  const createDebugger = require('redux-flipper').default;
  middlewares.push(createDebugger());
}

const store = configureStore({
  reducer,
  middleware: middlewares,
});

/**
 * The exports below come in handy when dispatching from a file outside of any of the Child component's
 */
export type AppDispatch = typeof store.dispatch;
export type GetState = typeof store.getState;

export default store;
