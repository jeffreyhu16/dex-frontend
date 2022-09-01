import { configureStore } from "@reduxjs/toolkit";
import providerSlice from "./providerSlice";
import tokenSlice from "./tokenSlice";
import exchangeSlice from "./exchangeSlice";

export default configureStore({
    reducer: {
        providerSlice,
        tokenSlice,
        exchangeSlice
    }
});
