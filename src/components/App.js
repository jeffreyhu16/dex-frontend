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
    loadNetwork,
    loadAccount
} from '../redux/providerSlice';

export default function App() {

    let provider;
    const dispatch = useDispatch();

    const loadChainData = async () => {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        const { chainId } = await provider.getNetwork();
        dispatch(setConnection(provider.connection));
        dispatch(setChainId(chainId));
        console.log(provider['_network'])
        const { NXP, mETH, mDAI, exchange } = config[chainId];
        dispatch(loadToken(NXP.address, provider));
        dispatch(loadToken(mETH.address, provider));
        dispatch(loadExchange(exchange.address, provider));
    }

    React.useEffect(() => {
        try {
            if (window.ethereum) {
                loadChainData();

                window.ethereum.on('chainChanged', () => {
                    loadChainData();
                    console.log('network changed...');    
                });
        
                window.ethereum.on('accountsChanged', () => {
                    dispatch(loadAccount(provider));
                });
            } else {
                console.log('No MetaMask detected...');
            }
        } catch (err) {
            console.log(err);
        }
    }, []);

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
