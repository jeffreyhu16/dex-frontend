import { ethers } from 'ethers';
import React from 'react';
import Navbar from './Navbar';
import config from '../config.json';
import { useSelector, useDispatch } from 'react-redux';
import { loadToken } from '../redux/tokenSlice';
import { loadExchange } from '../redux/exchangeSlice';
import { 
    loadConnection, 
    loadNetwork, 
    loadAccount
} from '../redux/providerSlice';

export default function App() {

    const dispatch = useDispatch();
    
    const loadChainData = async () => {
        try {
            if (window.ethereum) {
                const provider = dispatch(loadConnection());
                const chainId = await dispatch(loadNetwork(provider));
                await dispatch(loadAccount());
                await dispatch(loadToken(config[chainId].NXP.address, provider));
                await dispatch(loadExchange(config[chainId].exchange.address, provider));
            } else {
                console.log('no metamask detected...');
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
