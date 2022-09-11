import { createSlice } from "@reduxjs/toolkit";

export const tokenSlice = createSlice({
    name: 'tokens',
    initialState: {
        symbols: [],
    },
    reducers: {
        setSymbols: (state, action) => {
            state.symbols = action.payload;
        },
    }
});

export const loadTokens = (token_1, token_2) => {
    return async dispatch => {
        const symbol_1 = await token_1.symbol();
        const symbol_2 = await token_2.symbol();
        dispatch(setSymbols([symbol_1, symbol_2]));
    }
}

export const { setSymbols, clearTokens } = tokenSlice.actions;

export default tokenSlice.reducer;
