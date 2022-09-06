import { createSlice } from "@reduxjs/toolkit";
import TOKEN_ABI from '../abi/Token.json';
import { ethers } from "ethers";

export const tokenSlice = createSlice({
    name: 'token',
    initialState: {
        NXP: {
            loaded: false,
        },
        mETH: {
            loaded: false,
        },
        mDAI: {
            loaded: false,
        },
    },
    reducers: {
        setTokens: {
            reducer: (state, action) => {
                const { symbols } = action.payload;
                state[symbols[0]].loaded = true;
                state[symbols[1]].loaded = true;
                
            },
            prepare: (symbols) => ({
                payload: { symbols }
            })
        },
        clearTokens: (state, action) => {
            // for (let token of state.token) {
            //     token.loaded = false;
            // }
            console.log(state)
        }
    }
});

export const loadTokens = tokens => {
    return async dispatch => {
        dispatch(clearTokens());
        const symbol_1 = await tokens[0].symbol();
        const symbol_2 = await tokens[1].symbol();
        dispatch(setTokens([symbol_1, symbol_2]));
        console.log(symbol_1, symbol_2)
    }
}

export const { setTokens, clearTokens } = tokenSlice.actions;

export default tokenSlice.reducer;
