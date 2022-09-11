import React from 'react';
import { ethers } from 'ethers';
import { useDispatch, useSelector } from 'react-redux';
import config from '../config.json';
import TOKEN_ABI from '../abi/Token.json';
import EXCHANGE_ABI from '../abi/Exchange.json';
import logo from '../assets/dapp.svg';
import eth from '../assets/eth.svg';
import { depositToken } from '../redux/exchangeSlice';

export default function Balance() {

    const dispatch = useDispatch();

    const { account, chainId } = useSelector(state => state.provider);
    const symbols = useSelector(state => state.tokens.symbols);

    const events = useSelector(state => state.exchange.events);

    const [exchange, setExchange] = React.useState();
    const [tokenPair, setTokenPair] = React.useState();

    const [balances, setBalances] = React.useState({
        wallet_1: '0',
        exchange_1: '0',
        wallet_2: '0',
        exchange_2: '0',
    });

    const [deposit, setDeposit] = React.useState({ token_1: '', token_2: '' });

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
        if (tokenPair && account) {
            loadBalances();
            setDeposit({ token_1: '', token_2: '' });
        }
    }, [tokenPair, events]);

    const loadBalances = async () => {
        const { formatEther } = ethers.utils;
        const { token_1, token_2 } = tokenPair;
        const newBalances = {
            wallet_1: formatEther(await token_1.balance(account)),
            exchange_1: formatEther(await exchange.tokens(token_1.address, account)),
            wallet_2: formatEther(await token_2.balance(account)),
            exchange_2: formatEther(await exchange.tokens(token_2.address, account))
        }
        setBalances(newBalances);
        console.log('balance loading...')
    }

    const changeHandler = (e, token) => {
        setDeposit(prev => ({
            ...prev,
            [token]: e.target.value
        }));
    }

    const depositHandler = token => {
        console.log('deposit submitted...')
        dispatch(depositToken(exchange, tokenPair[token], deposit[token]));
    }

    return (
        <div className='component exchange__transfers'>
            <div className='component__header flex-between'>
                <h2>Balance</h2>
                <div className='tabs'>
                    <button className='tab tab--active'>Deposit</button>
                    <button className='tab'>Withdraw</button>
                </div>
            </div>

            {/* Deposit/Withdraw Component 1 (DApp) */}

            <div className='exchange__transfers--form'>
                <div className='flex-between'>
                    <div>
                        <small>Token</small>
                        <br />
                        <img src={logo} alt='' className='exchange-transfers-token' />
                        {symbols.length > 1 && symbols[0]}
                    </div>
                    <div>
                        <small>Wallet</small>
                        <br />
                        {balances.wallet_1}
                    </div>
                    <div>
                        <small>Exchange</small>
                        <br />
                        {balances.exchange_1}
                    </div>
                </div>

                <form>
                    <label htmlFor="token_1"></label>
                    <input
                        type="text"
                        id='token_1'
                        placeholder='0.0000'
                        value={deposit.token_1}
                        onChange={e => changeHandler(e, 'token_1')}
                    />

                    <button className='button' type='button' onClick={() => depositHandler('token_1')}> 
                        <span>Deposit</span>
                    </button>
                </form>
            </div>

            <hr />

            {/* Deposit/Withdraw Component 2 (mETH) */}

            <div className='exchange__transfers--form'>
                <div className='flex-between'>
                    <div>
                        <small>Token</small>
                        <br />
                        <img src={eth} alt='' className='exchange-transfers-token' />
                        {symbols.length > 1 && symbols[1]}
                    </div>
                    <div>
                        <small>Wallet</small>
                        <br />
                        {balances.wallet_2}
                    </div>
                    <div>
                        <small>Exchange</small>
                        <br />
                        {balances.exchange_2}
                    </div>
                </div>

                <form>
                    <label htmlFor="token_2"></label>
                    <input type="text" id='token_2' placeholder='0.0000' />

                    <button className='button' type='submit'>
                        <span>Deposit</span>
                    </button>
                </form>
            </div>

            <hr />
        </div>
    );
}