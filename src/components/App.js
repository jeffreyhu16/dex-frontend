import { ethers } from 'ethers';
import React from 'react';
import Navbar from './Navbar';
import config from '../config.json';
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

    const dispatch = useDispatch();

    const loadChainData = async () => {
        try {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const { chainId } = await provider.getNetwork();
                dispatch(setConnection(provider.connection));
                dispatch(setChainId(chainId));

                dispatch(loadAccount(provider));
                dispatch(loadToken(config[chainId].NXP.address, provider));
                dispatch(loadExchange(config[chainId].exchange.address, provider));
            } else {
                console.log('No MetaMask detected...');
            }
        } catch (err) {
            console.log(err);
        }
    }

    React.useEffect(() => {
        loadChainData();
    }, []);

    return (
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
    );
}
