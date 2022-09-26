import { ethers } from 'ethers';
import React from 'react';
import Navbar from './Navbar';
import Markets from './Markets';
import Balance from './Balance';
import Order from './Order';
import OrderBook from './OrderBook';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DARK_THEME } from '../mui/dark.theme';
import { useSelector, useDispatch } from 'react-redux';
import { loadChainData, loadAccount } from '../redux/providerSlice';
import { loadExchange, loadOrders } from '../redux/exchangeSlice';
import PriceChart from './PriceChart';

export default function App() {

    const dispatch = useDispatch();

    const { account, chainId } = useSelector(state => state.provider);

    const [exchange, setExchange] = React.useState();

    React.useEffect(() => {
        try {
            if (window.ethereum) { // check for unavailable chains
                dispatch(loadChainData());

                window.ethereum.on('chainChanged', () => {
                    dispatch(loadChainData());
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
        if (chainId) {
            const exchange = dispatch(loadExchange(chainId));
            dispatch(loadOrders(exchange));
            setExchange(exchange);
        }
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
                        <Markets />
                        <Balance exchange={exchange} />
                        <Order exchange={exchange} />
                    </section>
                    <section className='exchange__section--right grid'>
                        <PriceChart />
                        {/* Transactions */}
                        {/* Trades */}
                        <OrderBook exchange={exchange} />
                    </section>
                </main>
                {/* Alert */}
            </div>
        </ThemeProvider>
    )
}
