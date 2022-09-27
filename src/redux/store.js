import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import provider from "./providerSlice";
import tokens from "./tokenSlice";
import exchange from "./exchangeSlice";
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
    provider,
    tokens,
    exchange
});

const persistConfig = {
    key: 'root',
    storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: rootReducer,
    // reducer: persistedReducer,
    middleware: [thunk]
});

export const persistor = persistStore(store);
