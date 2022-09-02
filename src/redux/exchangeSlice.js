import { createSlice } from "@reduxjs/toolkit";
import EXCHANGE_ABI from '../abi/Exchange.json';
import { ethers } from "ethers";

export const exchangeSlice = createSlice({
    name: 'exchange',
    initialState: {
        loaded: false,
    },
    reducers: {
        setExchange: {
            reducer: (state, action) => {
                const { functions } = action.payload;
                state.loaded = true;
            },
            prepare: (functions) => ({
                payload: { functions }
            })
        },
    }
});

export const loadExchange = (address, provider) => {
    return async dispatch => {
        const exchange = new ethers.Contract(address, EXCHANGE_ABI, provider);
        dispatch(setExchange(''));
        // console.log(exchange)
        return exchange;
    }
}

export const { setExchange } = exchangeSlice.actions;

export default exchangeSlice.reducer;
