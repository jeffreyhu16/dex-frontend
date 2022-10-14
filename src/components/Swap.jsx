import React from 'react';
import { ethers } from 'ethers';
import { useDispatch, useSelector } from 'react-redux';
import config from '../config/chains.json';
import TOKEN_ABI from '../abi/Token.json';
import CHAINLINK_ABI from '../abi/AggregatorV3Interface.json';
import dai from '../assets/dai.svg';
import swap from '../assets/swap.svg';
import eth from '../assets/eth.svg';
import { depositToken, withdrawToken } from '../redux/exchangeSlice';

export default function Swap(props) {

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

    const [isBuy, setIsBuy] = React.useState(true);
    const [ETHPair, setETHPair] = React.useState({ token_1: '', token_2: '' });
    const [DAIPair, setDAIPair] = React.useState({ token_1: '', token_2: '' });

    const buyTab = React.useRef(null);
    const sellTab = React.useRef(null);

    React.useEffect(() => {
        if (DAIPair.token_1) {
            const getPriceFeed = setTimeout(async () => {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const priceFeed = new ethers.Contract(config[chainId].ETH_PriceFeed.address, CHAINLINK_ABI, provider);
                const roundData = await priceFeed.latestRoundData()
                const ETH_price = ethers.utils.formatUnits(roundData.answer, 8);
                const token_2_price = (DAIPair.token_1 * ETH_price).toFixed(0);
                setDAIPair(prev => ({
                    ...prev,
                    token_2: token_2_price
                }));
            }, 1000);
            return () => clearTimeout(getPriceFeed);
        }
    }, [DAIPair.token_1]);

    const ETHPairHandler = e => {
        setETHPair({
            token_1: e.target.value,
            token_2: e.target.value
        });
    }

    const DAIPairHandler = e => {
        setDAIPair(prev => ({
            ...prev,
            token_1: e.target.value
        }));
    }

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

    const submitHandler = token => {

    }

    return (
        <div className='component exchange__transfers'>
            <div className='component__header flex-between'>
                <h2>Swap</h2>
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

            {/* Deposit/Withdraw Component 1 (DApp) */}

            <div className='exchange__transfers--form'>
                <div className='swap-container'>
                    <div>
                        <small>{isBuy ? 'GoerliETH' : 'mETH'}</small>
                        <br />
                        <div className='swap-token-1'>
                            <img src={eth} alt='' className='exchange-transfers-token' />
                            <span>{ETHPair.token_1}</span>
                        </div>
                    </div>
                    <div>
                        <img src={swap} alt='' className='img-swap' />
                    </div>
                    <div>
                        <small>{isBuy ? 'mETH' : 'GoerliETH'}</small>
                        <br />
                        <div className='swap-token-2'>
                            <img src={eth} alt='' className='exchange-transfers-token' />
                            <span>{ETHPair.token_2}</span>
                        </div>
                    </div>
                </div>

                <form>
                    <label htmlFor="token_1"></label>
                    <input
                        type="text"
                        id='token_1'
                        placeholder='0.0000'
                        value={ETHPair.token_1}
                        onChange={e => ETHPairHandler(e)}
                    />

                    <button
                        type='button'
                        disabled={!account}
                        className='button'
                        onClick={() => submitHandler('token_1')}
                    >
                        <span>Swap</span>
                    </button>
                </form>
            </div>

            <hr />

            {/* Deposit/Withdraw Component 2 (mETH) */}

            <div className='exchange__transfers--form'>
                <div className='swap-container'>
                    <div>
                        <small>{isBuy ? 'GoerliETH' : 'mDAI'}</small>
                        <br />
                        <div className='swap-token-1'>
                            <img src={isBuy ? eth : dai} alt='' className='exchange-transfers-token' />
                            <span>{DAIPair.token_1}</span>
                        </div>
                    </div>
                    <div>
                        <img src={swap} alt='' className='img-swap' />
                    </div>
                    <div>
                        <small>{isBuy ? 'mDAI' : 'GoerliETH'}</small>
                        <br />
                        <div className='swap-token-2'>
                            <img src={isBuy ? dai : eth} alt='' className='exchange-transfers-token' />
                            <span>{DAIPair.token_2}</span>
                        </div>
                    </div>
                </div>

                <form>
                    <label htmlFor="token_2"></label>
                    <input
                        type="text"
                        id='token_2'
                        placeholder='0.0000'
                        value={DAIPair.token_1}
                        onChange={e => DAIPairHandler(e)}
                    />

                    <button
                        type='button'
                        disabled={!account}
                        className='button'
                        onClick={() => submitHandler('token_2')}
                    >
                        <span>Swap</span>
                    </button>
                </form>
            </div>

            <hr />
        </div>
    )
}
