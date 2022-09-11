import { createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";

export const providerSlice = createSlice({
    name: 'provider',
    initialState: {},
    reducers: {
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

export const loadChainData = () => {
    return async dispatch => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const { chainId } = await provider.getNetwork();
        console.log(chainId)
        dispatch(setChainId(chainId));
    }
}

export const loadAccount = () => {
    return async dispatch => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.utils.getAddress(accounts[0]);
        const balance = ethers.utils.formatEther(await provider.getBalance(account));
        dispatch(setAccount(account, balance));
    }
}

export const { setChainId, setAccount } = providerSlice.actions;

export default providerSlice.reducer;
