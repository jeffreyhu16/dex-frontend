import { createSlice } from "@reduxjs/toolkit";
import EXCHANGE_ABI from '../abi/Exchange.json';
import config from '../config/chains.json';
import { ethers } from "ethers";

export const exchangeSlice = createSlice({
    name: 'exchange',
    initialState: {
        transaction: {},
        orders: [],
        cancelledOrders: [],
        filledOrders: [],
        events: []
    },
    reducers: {
        setOrders: (state, action) => {
            state.orders = action.payload;
        },
        setCancelledOrders: (state, action) => {
            state.cancelledOrders = action.payload;
        },
        setFilledOrders: (state, action) => {
            state.filledOrders = action.payload;
        },
        initiateTx: (state, action) => {
            const txType = action.payload;
            state.transaction = {
                type: txType,
                isPending: true,
                isSuccessful: false,
                isError: false
            }
        },
        finalizeTx: {
            reducer: (state, action) => {
                const { txType, args } = action.payload;
                switch (txType) {
                    case 'makeOrder':
                        state.orders = [...state.orders, args];
                        break;
                    case 'cancelOrder':
                        state.cancelledOrders = [...state.cancelledOrders, args];
                        break;
                    case 'fillOrder':
                        state.filledOrders = [...state.filledOrders, args];
                        break;
                }
                // console.log('finalizing tx...')
                // console.log(txType)
                // console.log(args)
                state.transaction = {
                    type: txType,
                    isPending: false,
                    isSuccessful: true,
                    isError: false
                }
                state.events = [{ type: txType, ...args }, ...state.events];
            },
            prepare: (txType, args) => ({
                payload: { txType, args }
            })
        },
        failTx: (state, action) => {
            const txType = action.payload;
            state.transaction = {
                type: txType,
                isPending: false,
                isSuccessful: false,
                isError: true
            }
        }
    },
});

export const loadExchange = chainId => {
    return dispatch => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const exchange = new ethers.Contract(config[chainId].exchange.address, EXCHANGE_ABI, provider);
        exchange.on('Deposit', (token, user, amount, balance, event) => { // ensure no duplicate events
            console.log(event)
            const args = {
                token,
                user,
                amount: ethers.utils.formatEther(amount),
                balance: ethers.utils.formatEther(balance),
                txHash: event.transactionHash
            }
            dispatch(finalizeTx('Deposit', args));
        });
        exchange.on('Withdraw', (token, user, amount, balance, event) => {
            const args = {
                token,
                user,
                amount: ethers.utils.formatEther(amount),
                balance: ethers.utils.formatEther(balance),
                txHash: event.transactionHash
            }
            dispatch(finalizeTx('Withdraw', args));
        });
        exchange.on('OrderMade', (id, user, tokenGet, amountGet, tokenGive, amountGive, timestamp, event) => {
            const args = {
                id: id.toNumber(),
                user,
                tokenGet,
                amountGet: ethers.utils.formatEther(amountGet),
                tokenGive,
                amountGive: ethers.utils.formatEther(amountGive),
                timestamp: timestamp.toNumber(),
                txHash: event.transactionHash
            }
            dispatch(finalizeTx('makeOrder', args));
        });
        exchange.on('OrderCancelled', (id, user, tokenGet, amountGet, tokenGive, amountGive, timestamp, event) => {
            const args = {
                id: id.toNumber(),
                user,
                tokenGet,
                amountGet: ethers.utils.formatEther(amountGet),
                tokenGive,
                amountGive: ethers.utils.formatEther(amountGive),
                timestamp: timestamp.toNumber(),
                txHash: event.transactionHash
            }
            dispatch(finalizeTx('cancelOrder', args));
        });
        exchange.on('Trade', (id, user, tokenGet, amountGet, tokenGive, amountGive, creator, timestamp, event) => {
            const args = {
                id: id.toNumber(),
                user,
                tokenGet,
                amountGet: ethers.utils.formatEther(amountGet),
                tokenGive,
                amountGive: ethers.utils.formatEther(amountGive),
                creator,
                timestamp: timestamp.toNumber(),
                txHash: event.transactionHash
            }
            dispatch(finalizeTx('fillOrder', args));
        });
        return exchange;
    }
}

export const loadOrders = exchange => {
    return async dispatch => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const block = await provider.getBlockNumber();

        const orderStream = await exchange.queryFilter('OrderMade', 0, block);
        const orders = orderStream.map(event => {
            const { id, user, tokenGet, amountGet, tokenGive, amountGive, timestamp } = event.args;
            return {
                id: id.toNumber(),
                user,
                tokenGet,
                amountGet: ethers.utils.formatEther(amountGet),
                tokenGive,
                amountGive: ethers.utils.formatEther(amountGive),
                timestamp: timestamp.toNumber()
            }
        });
        dispatch(setOrders(orders));

        const cancelStream = await exchange.queryFilter('OrderCancelled', 0, block);
        const cancelOrders = cancelStream.map(event => {
            const { id, user, tokenGet, amountGet, tokenGive, amountGive, timestamp } = event.args;
            return {
                id: id.toNumber(),
                user,
                tokenGet,
                amountGet: ethers.utils.formatEther(amountGet),
                tokenGive,
                amountGive: ethers.utils.formatEther(amountGive),
                timestamp: timestamp.toNumber()
            }
        });
        dispatch(setCancelledOrders(cancelOrders));

        const fillStream = await exchange.queryFilter('Trade', 0, block);
        const fillOrders = fillStream.map(event => {
            const { id, user, tokenGet, amountGet, tokenGive, amountGive, creator, timestamp } = event.args;
            return {
                id: id.toNumber(),
                user,
                tokenGet,
                amountGet: ethers.utils.formatEther(amountGet),
                tokenGive,
                amountGive: ethers.utils.formatEther(amountGive),
                creator,
                timestamp: timestamp.toNumber()
            }
        });
        dispatch(setFilledOrders(fillOrders));
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

export const makeOrder = (exchange, tokens, amount, price, isBuy) => { // ensure no duplicate orders
    return async dispatch => {
        dispatch(initiateTx('makeOrder'));
        try {
            const { parseEther } = ethers.utils;
            let args;
            if (isBuy) {
                args = [
                    tokens.token_1.address,
                    parseEther(amount),
                    tokens.token_2.address,
                    parseEther((amount * price).toString())
                ];
            } else {
                args = [
                    tokens.token_2.address,
                    parseEther((amount * price).toString()),
                    tokens.token_1.address,
                    parseEther(amount)
                ];
            }
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const orderTx = await exchange.connect(signer).makeOrder(...args);
            await orderTx.wait();
        } catch (err) {
            dispatch(failTx('makeOrder'));
            console.log(err);
        }
    }
}

export const cancelOrder = (exchange, id) => {
    return async dispatch => {
        dispatch(initiateTx('cancelOrder'));
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const tx = await exchange.connect(signer).cancelOrder(id);
            await tx.wait();
        } catch (err) {
            dispatch(failTx('cancelOrder'));
            console.log(err);
        }
    }
}

export const fillOrder = (exchange, id) => {
    return async dispatch => {
        dispatch(initiateTx('fillOrder'));
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const tx = await exchange.connect(signer).fillOrder(id);
            await tx.wait();
        } catch (err) {
            dispatch(failTx('fillOrder'));
            console.log(err);
        }
    }
}

export const {
    setOrders,
    setCancelledOrders,
    setFilledOrders,
    initiateTx,
    finalizeTx,
    failTx
} = exchangeSlice.actions;

export default exchangeSlice.reducer;
