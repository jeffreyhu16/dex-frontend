import React from 'react';
import { ethers } from 'ethers';
import config from '../config/chains.json';
import TOKEN_ABI from '../abi/Token.json';
import { useDispatch, useSelector } from 'react-redux';
import { buyOrderSelector, sellOrderSelector } from '../redux/selectors';
import sort from '../assets/sort.svg';

export default function OrderBook(props) {

    const { exchange } = props;

    const dispatch = useDispatch();

    const [tokenPair, setTokenPair] = React.useState();

    const { account, chainId } = useSelector(state => state.provider);
    const symbols = useSelector(state => state.tokens.symbols);
    const buyOrders = useSelector(state => buyOrderSelector(state, tokenPair));
    const sellOrders = useSelector(state => sellOrderSelector(state, tokenPair));

    React.useEffect(() => {
        if (symbols.length) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const token_1 = new ethers.Contract(config[chainId][symbols[0]].address, TOKEN_ABI, provider);
            const token_2 = new ethers.Contract(config[chainId][symbols[1]].address, TOKEN_ABI, provider);
            setTokenPair({ token_1, token_2 });
        }
    }, [symbols, account]);

    let sellOrderTable, buyOrderTable;
    if (sellOrders) {
        sellOrderTable = sellOrders.map((order, i) => {
            return (
                <tr key={i}>
                    <td>{order.amountGive}</td>
                    <td className={order.orderTypeClass}>
                        {order.tokenPrice}
                    </td>
                    <td>{order.amountGet}</td>
                </tr>
            )
        });
    }

    if (buyOrders) {
        buyOrderTable = buyOrders.map((order, i) => {
            return (
                <tr key={i}>
                    <td>{order.amountGet}</td>
                    <td className={order.orderTypeClass}>
                        {order.tokenPrice}
                    </td>
                    <td>{order.amountGive}</td>
                </tr>
            )
        });

    }

    return (
        <div className="component exchange__orderbook">
            <div className='component__header flex-between'>
                <h2>Order Book</h2>
            </div>

            <div className="flex">

                <table className='exchange__orderbook--sell'>
                    <caption>Selling</caption>
                    <thead>
                        <tr>
                            <th>
                                {symbols.length && symbols[0]}
                                <img src={sort} alt='' />
                            </th>
                            <th>
                                {symbols.length && `${symbols[0]}/${symbols[1]}`}
                                <img src={sort} alt='' />
                            </th>
                            <th>
                                {symbols.length && symbols[1]}
                                <img src={sort} alt='' />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sellOrderTable}
                    </tbody>
                </table>

                <div className='divider'></div>

                <table className='exchange__orderbook--buy'>
                    <caption>Buying</caption>
                    <thead>
                        <tr>
                            <th>
                                {symbols.length && symbols[0]}
                                <img src={sort} alt='' />
                            </th>
                            <th>
                                {symbols.length && `${symbols[0]}/${symbols[1]}`}
                                <img src={sort} alt='' />
                            </th>
                            <th>
                                {symbols.length && symbols[1]}
                                <img src={sort} alt='' />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {buyOrderTable}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
