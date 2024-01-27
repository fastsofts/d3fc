import { legacy_createStore as createStore, applyMiddleware, Store, Action } from 'redux';
import {thunk} from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";
import { createWrapper } from "next-redux-wrapper";
import rootReducer from "./reducers";
import reduxPromiseMiddleware from 'redux-promise-middleware';
import logger from 'redux-logger';


// initial states here
const initalState = {};

// middleware
//const middleware = [thunk];
const middleware = applyMiddleware(reduxPromiseMiddleware, thunk);

// creating store
export const store = createStore(
  rootReducer,
  initalState,
  middleware
);

// assigning store to next wrapper
const makeStore = () => store;

export const wrapper = createWrapper(makeStore);