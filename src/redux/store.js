import { configureStore } from "@reduxjs/toolkit";
import provider from "./providerSlice";
import tokens from "./tokenSlice";
import exchange from "./exchangeSlice";

export default configureStore({
    reducer: {
        provider,
        tokens,
        exchange
    }
});
