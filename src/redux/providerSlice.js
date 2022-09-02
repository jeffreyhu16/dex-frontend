import { createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";

export const providerSlice = createSlice({
    name: 'provider',
    initialState: {},
    reducers: {
        setConnection: (state, action) => {
            state.connection = action.payload;
        },
        setChainId: (state, action) => {
            state.chainId = action.payload;
        },
        setAccount: {
            reducer: (state, action) => {
                const { account, balance } = action.payload;
                state.account = account;
                state.balance = balance;
            },
            prepare: (account, balance) => ({
                payload: { account, balance }
            })
        }
    }
});

export const loadAccount = provider => {
    return async dispatch => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.utils.getAddress(accounts[0]);
        const balance = ethers.utils.formatEther(await provider.getBalance(account));
        dispatch(setAccount(account, balance));
    }
}

export const { setConnection, setChainId, setAccount } = providerSlice.actions;

export default providerSlice.reducer;
