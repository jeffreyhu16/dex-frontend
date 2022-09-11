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
        initiateTx: (state, action) => {
            const txType = action.payload;
            state.transaction = {
                transactionType: txType,
                isPending: true,
                isSuccessful: false
            }
        },
        finalizeTx: {
            reducer: (state, action) => {
                const { txType, args } = action.payload;
                state.transaction = {
                    transactionType: txType,
                    isPending: false,
                    isSuccessful: true
                }
                state.events = [...state.events, { event: 'Deposit', args }];
            },
            prepare: (txType, args) => ({
                payload: { txType, args }
            })
        },
        failTx: (state, action) => {
            const txType = action.payload;
            state.transaction = {
                transactionType: txType,
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
            dispatch(finalizeTx('Deposit', args));
        });
        exchange.on('Withdraw', (token, user, amount, balance) => {
            const args = {
                token,
                user,
                amount: ethers.utils.formatEther(amount),
                balance: ethers.utils.formatEther(balance)
            }
            dispatch(finalizeTx('Withdraw', args));
        });
    }
}

export const depositToken = (exchange, token, amount) => {
    return async dispatch => {
        dispatch(initiateTx('Deposit'));
        try {
            const { parseEther } = ethers.utils;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const approveTx = await token.connect(signer).approve(exchange.address, parseEther(amount));
            await approveTx.wait();
            const depositTx = await exchange.connect(signer).depositToken(token.address, parseEther(amount));
            await depositTx.wait();
        } catch (err) {
            dispatch(failTx('Withdraw'));
            console.log(err);
        }
    }
}

export const withdrawToken = (exchange, token, amount) => {
    return async dispatch => {
        dispatch(initiateTx('Withdraw'));
        try {
            const { parseEther } = ethers.utils;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const withdrawTx = await exchange.connect(signer).withdrawToken(token.address, parseEther(amount));
            await withdrawTx.wait();
        } catch (err) {
            dispatch(failTx('Withdraw'));
            console.log(err);
        }
    }
}

export const { initiateTx, finalizeTx, failTx } = exchangeSlice.actions;

export default exchangeSlice.reducer;
