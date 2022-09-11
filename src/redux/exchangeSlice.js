import { createSlice } from "@reduxjs/toolkit";
import EXCHANGE_ABI from '../abi/Exchange.json';
import config from '../config.json';
import { ethers } from "ethers";

export const exchangeSlice = createSlice({
    name: 'exchange',
    initialState: {
        transaction: {},
        events: []
    },
    reducers: {
        initiateDeposit: (state, action) => {
            state.transaction = {
                transactionType: 'Deposit',
                isPending: true,
                isSuccessful: false
            }
        },
        finalizeDeposit: (state, action) => {
            const args = action.payload;
            state.transaction = {
                transactionType: 'Deposit',
                isPending: false,
                isSuccessful: true
            }
            state.events = [...state.events, {event: 'Deposit', args }];
        },
        failDeposit: (state, action) => {
            state.transaction = {
                transactionType: 'Deposit',
                isPending: false,
                isSuccessful: false
            }
        }
    },
});

export const loadExchange = chainId => {
    return dispatch => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const exchange = new ethers.Contract(config[chainId].exchange.address, EXCHANGE_ABI, provider);
        exchange.on('Deposit', (token, user, amount, balance) => {
            const args = {
                token,
                user,
                amount: ethers.utils.formatEther(amount),
                balance: ethers.utils.formatEther(balance)
            }
            dispatch(finalizeDeposit(args));
        });
    }
}

export const depositToken = (exchange, token, amount) => {
    return async dispatch => {
        dispatch(initiateDeposit());
        try {
            const { parseEther } = ethers.utils;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const approveTx = await token.connect(signer).approve(exchange.address, parseEther(amount));
            await approveTx.wait();
            const depositTx = await exchange.connect(signer).depositToken(token.address, parseEther(amount));
            await depositTx.wait();
        } catch (err) {
            dispatch(failDeposit());
            console.log(err);
        }
    }
}

export const { initiateDeposit, finalizeDeposit, failDeposit } = exchangeSlice.actions;

export default exchangeSlice.reducer;
