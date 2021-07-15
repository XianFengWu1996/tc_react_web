import { createStore, applyMiddleware } from "redux";
import rootReducer from "../redux/reducers/index.js";
import { createFirestoreInstance } from "redux-firestore";
import firebase from "firebase/app";
import fbConfig from "../config/fbConfig";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import logger from "redux-logger";
import compose from 'compose';

const persistConfig = {
  // Root
  key: "root",
  storage: storage,
  // Whitelist (Save Specific Reducers)
  whitelist: ['auth', 'customer','cart', 'reward', 'menu'],
  // Blacklist (Don't Save Specific Reducers)
};

const pReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  compose(
    pReducer,
    applyMiddleware(thunk, logger),
    ),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

);

const rrfProps = {
    firebase,
    config: fbConfig,
    dispatch: store.dispatch,
    createFirestoreInstance,
  };

const persistor = persistStore(store);

export { persistor, store, rrfProps };
