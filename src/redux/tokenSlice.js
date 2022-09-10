import { createSlice } from "@reduxjs/toolkit";

export const tokenSlice = createSlice({
    name: 'tokens',
    initialState: {
        symbols: [],
    },
    reducers: {
        setTokens: {
            reducer: (state, action) => {
                const symbols = action.payload;
                state.symbols = symbols;
            },
            // prepare: (symbol_1, symbol_2) => ({
            //     payload: { symbol_1, symbol_2 }
            // })
        },
    }
});

export const loadTokens = (token_1, token_2) => {
    return async dispatch => {
        const symbol_1 = await token_1.symbol();
        const symbol_2 = await token_2.symbol();
        dispatch(setTokens([symbol_1, symbol_2]));
    }
}

export const { setTokens, clearTokens } = tokenSlice.actions;

export default tokenSlice.reducer;
