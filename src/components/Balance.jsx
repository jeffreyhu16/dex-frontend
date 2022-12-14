import React from 'react';
import { ethers } from 'ethers';
import { useDispatch, useSelector } from 'react-redux';
import config from '../config/chains.json';
import TOKEN_ABI from '../abi/Token.json';
import EXCHANGE_ABI from '../abi/Exchange.json';
import logo from '../assets/dapp.svg';
import eth from '../assets/eth.svg';
import { depositToken, withdrawToken } from '../redux/exchangeSlice';

export default function Balance(props) {

    const { exchange } = props;

    const dispatch = useDispatch();

    const { account, chainId } = useSelector(state => state.provider);
    const symbols = useSelector(state => state.tokens.symbols);

    const events = useSelector(state => state.exchange.events);

    const [tokenPair, setTokenPair] = React.useState();
    const [balances, setBalances] = React.useState({
        wallet_1: '0',
        exchange_1: '0',
        wallet_2: '0',
        exchange_2: '0',
    });

    const [isDeposit, setIsDeposit] = React.useState(true);
    const [amount, setAmount] = React.useState({ token_1: '', token_2: '' });

    const depositTab = React.useRef(null);
    const withdrawTab = React.useRef(null);

    React.useEffect(() => {
        if (symbols.length && account) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const token_1 = new ethers.Contract(config[chainId][symbols[0]].address, TOKEN_ABI, provider);
            const token_2 = new ethers.Contract(config[chainId][symbols[1]].address, TOKEN_ABI, provider);
            setTokenPair({ token_1, token_2 });
        }
    }, [symbols, account]);

    React.useEffect(() => {
        if (tokenPair && account) {
            loadBalances();
            setAmount({ token_1: '', token_2: '' });
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

    const tabHandler = e => {
        if (e.target.className === depositTab.current.className) {
            withdrawTab.current.className = 'tab';
            setIsDeposit(true);
        } else {
            depositTab.current.className = 'tab';
            setIsDeposit(false);
        }
        e.target.className = 'tab tab--active';
    }

    const changeHandler = (e, token) => {
        setAmount(prev => ({
            ...prev,
            [token]: e.target.value
        }));
    }

    const submitHandler = token => {
        if (isDeposit) {
            console.log('deposit submitted...');
            dispatch(depositToken(exchange, tokenPair[token], amount[token]));
        } else {
            console.log('withdraw submitted...');
            dispatch(withdrawToken(exchange, tokenPair[token], amount[token]));
        }
    }

    return (
        <div className='component exchange__transfers'>
            <div className='component__header flex-between'>
                <h2>Balance</h2>
                <div className='tabs'>
                    <button
                        className='tab tab--active'
                        onClick={tabHandler}
                        ref={depositTab}
                    >
                        Deposit
                    </button>
                    <button
                        className='tab'
                        onClick={tabHandler}
                        ref={withdrawTab}
                    >
                        Withdraw
                    </button>
                </div>
            </div>

            {/* Deposit/Withdraw Component 1 (DApp) */}

            <div className='exchange__transfers--form'>
                <div className='flex-between'>
                    <div>
                        <small>Token</small>
                        <br />
                        <img src={logo} alt='' className='exchange-transfers-token' />
                        {symbols.length && symbols[0]}
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
                        value={amount.token_1}
                        onChange={e => changeHandler(e, 'token_1')}
                    />

                    <button
                        type='button'
                        disabled={!account}
                        className='button'
                        onClick={() => submitHandler('token_1')}
                    >
                        <span>{isDeposit ? 'Deposit' : 'Withdraw'}</span>
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
                        {symbols.length && symbols[1]}
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
                    <input
                        type="text"
                        id='token_2'
                        placeholder='0.0000'
                        value={amount.token_2}
                        onChange={e => changeHandler(e, 'token_2')}
                    />

                    <button
                        type='button'
                        disabled={!account}
                        className='button'
                        onClick={() => submitHandler('token_2')}
                    >
                        <span>{isDeposit ? 'Deposit' : 'Withdraw'}</span>
                    </button>
                </form>
            </div>

            <hr />
        </div>
    )
}
