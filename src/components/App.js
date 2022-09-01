import { ethers } from 'ethers';
import React from 'react';
import config from '../config.json';
import { useSelector, useDispatch } from 'react-redux';
import { loadToken } from '../redux/tokenSlice';
import { 
    loadConnection, 
    loadNetwork, 
    loadAccount
} from '../redux/providerSlice';
import { loadExchange } from '../redux/exchangeSlice';

export default function App() {

    const dispatch = useDispatch();
    
    const loadChainData = async () => {
        try {
            if (window.ethereum) {
                const account = await dispatch(loadAccount());
                console.log(account)

                const provider = dispatch(loadConnection());
                console.log(provider.connection);

                const chainId = await dispatch(loadNetwork(provider));
                console.log(chainId);

                const NXP = await dispatch(loadToken(config[chainId].NXP.address, provider));
                console.log(await NXP.symbol());

                await dispatch(loadExchange(config[chainId].exchange.address, provider))
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

            {/* Navbar */}

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
