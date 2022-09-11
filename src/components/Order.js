import React from 'react';
import { ethers } from 'ethers';
import config from '../config.json';
import TOKEN_ABI from '../abi/Token.json';
import EXCHANGE_ABI from '../abi/Exchange.json';
import { useDispatch, useSelector } from 'react-redux';
import { makeOrder } from '../redux/exchangeSlice';

export default function Order() {

    const dispatch = useDispatch();

    const { account, chainId } = useSelector(state => state.provider);
    const symbols = useSelector(state => state.tokens.symbols);
    const events = useSelector(state => state.exchange.events);

    const [exchange, setExchange] = React.useState();
    const [tokenPair, setTokenPair] = React.useState();

    const [isBuy, setIsBuy] = React.useState(true);
    const [amount, setAmount] = React.useState('');
    const [price, setPrice] = React.useState('');

    const buyTab = React.useRef(null);
    const sellTab = React.useRef(null);

    React.useEffect(() => {
        if (symbols.length > 1 && account) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const exchange = new ethers.Contract(config[chainId].exchange.address, EXCHANGE_ABI, provider);
            const token_1 = new ethers.Contract(config[chainId][symbols[0]].address, TOKEN_ABI, provider);
            const token_2 = new ethers.Contract(config[chainId][symbols[1]].address, TOKEN_ABI, provider);
            setExchange(exchange);
            setTokenPair({ token_1, token_2 });
        }
    }, [symbols, account]);

    React.useEffect(() => {
        if (events.length > 0) {console.log(events);}
    }, [events]);

    const tabHandler = e => {
        if (e.target.className === buyTab.current.className) {
            sellTab.current.className = 'tab';
            setIsBuy(true);
        } else {
            buyTab.current.className = 'tab';
            setIsBuy(false);
        }
        e.target.className = 'tab tab--active';
    }

    const submitHandler = () => {
        dispatch(makeOrder(exchange, tokenPair, amount, price, isBuy));
    }

    return (
        <div className="component exchange__orders">
            <div className='component__header flex-between'>
                <h2>New Order</h2>
                <div className='tabs'>
                    <button
                        className='tab tab--active'
                        onClick={tabHandler}
                        ref={buyTab}
                    >
                        Buy
                    </button>
                    <button
                        className='tab'
                        onClick={tabHandler}
                        ref={sellTab}
                    >
                        Sell
                    </button>
                </div>
            </div>

            <form>
                <label htmlFor='amount'>Amount</label>
                <input
                    type='text'
                    id='amount'
                    placeholder='0.0000'
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                />
                <label htmlFor='price'>Price</label>
                <input
                    type='text'
                    id='price'
                    placeholder='0.0000'
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                />

                <button className='button button--filled' type='button' onClick={submitHandler}>
                    <span>{isBuy ? 'Buy' : 'Sell'} NXP</span>
                </button>
            </form>
        </div>
    );
}