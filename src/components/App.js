import { ethers } from 'ethers';
import React from 'react';
import Navbar from './Navbar';
import config from '../config.json';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DARK_THEME } from '../mui/dark.theme';
import { useSelector, useDispatch } from 'react-redux';
import { loadToken } from '../redux/tokenSlice';
import { loadExchange } from '../redux/exchangeSlice';
import {
    setConnection,
    setChainId,
    loadAccount
} from '../redux/providerSlice';

export default function App() {

    const dispatch = useDispatch();

    const { account, chainId } = useSelector(state => state.provider);

    const loadChainData = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const { chainId } = await provider.getNetwork();

        dispatch(setConnection(provider.connection));
        dispatch(setChainId(chainId));

        const { NXP, mETH, mDAI, exchange } = config[chainId];
        dispatch(loadToken(NXP.address, provider));
        dispatch(loadToken(mETH.address, provider));
        dispatch(loadExchange(exchange.address, provider));
    }

    React.useEffect(() => {
        try {
            if (window.ethereum) { // check for unavailable chains
                loadChainData();

                window.ethereum.on('chainChanged', () => {
                    loadChainData();
                });

                window.ethereum.on('accountsChanged', () => {
                    dispatch(loadAccount());
                });
            } else {
                console.log('No MetaMask detected...');
            }
        } catch (err) {
            console.log(err);
        }
    }, []);

    React.useEffect(() => {
        if (account) {
            dispatch(loadAccount());
        }
    }, [chainId]);

    const darkTheme = createTheme(DARK_THEME);

    return (
        <ThemeProvider theme={darkTheme}>
            <div>
                <Navbar />
                <main className='exchange grid'>
                    <section className='exchange__section--left grid'>
                        {/* Markets */}
                        {/* Balance */}
                        {/* Order */}
                    </section>
                    <section className='exchange__section--right grid'>
                        {/* PriceChart */}
                        {/* Transactions */}
                        {/* Trades */}
                        {/* OrderBook */}
                    </section>
                </main>
                {/* Alert */}
            </div>
        </ThemeProvider>
    );
}
