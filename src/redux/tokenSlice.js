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
        setToken: {
            reducer: (state, action) => {
                const { functions, symbol } = action.payload;
                state[symbol].loaded = true;
                // state[symbol].functions = functions;
            },
            prepare: (functions, symbol) => ({
                payload: { functions, symbol }
            })
        },
    }
});

export const loadToken = (address, provider) => {
    return async dispatch => {
        const token = new ethers.Contract(address, TOKEN_ABI, provider);
        const symbol = await token.symbol();
        dispatch(setToken('', symbol));
        // console.log(token)
        return token;
    }
}

export const { setToken } = tokenSlice.actions;

export default tokenSlice.reducer;