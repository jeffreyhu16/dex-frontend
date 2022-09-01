import { createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";

export const providerSlice = createSlice({
    name: 'provider',
    initialState: {},
    reducers: {
        setConnection: (state, action) => {
            state.connection = action.payload;
        },
        setNetwork: (state, action) => {
            state.network = action.payload;
        },
        setAccount: (state, action) => {
            state.account = action.payload;
        }
    }
});

export const loadConnection = () => {
    return dispatch => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        dispatch(setConnection(provider.connection));
        return provider;
    }
}

export const loadNetwork = (provider) => {
    return async dispatch => {
        const { chainId } = await provider.getNetwork();
        dispatch(setNetwork(chainId));
        console.log('load network in redux...')
        return chainId;
    }
}

export const loadAccount = () => {
    return async dispatch => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.utils.getAddress(accounts[0]);
        dispatch(setAccount(account));
        return account;
    }
}

export const { setConnection, setNetwork, setAccount } = providerSlice.actions;

export default providerSlice.reducer;
