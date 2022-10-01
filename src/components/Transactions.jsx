import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import config from '../config/chains.json';
import TOKEN_ABI from '../abi/Token.json';
import { myOpenOrdersSelector, myTxSelector } from '../redux/selectors';
import { cancelOrder } from '../redux/exchangeSlice';
import sort from '../assets/sort.svg';
import Banner from './subComponents/Banner';

export default function Transactions(props) {

    const { exchange } = props;

    const [tokenPair, setTokenPair] = React.useState();
    const [showMyOrders, setShowMyOrders] = React.useState(true);

    const orderBtn = React.useRef(null);
    const txBtn = React.useRef(null);

    const dispatch = useDispatch();

    const { account, chainId } = useSelector(state => state.provider);
    const symbols = useSelector(state => state.tokens.symbols);
    const orders = useSelector(state => myOpenOrdersSelector(state, tokenPair, account));
    const transactions = useSelector(state => myTxSelector(state, tokenPair, account));

    React.useEffect(() => {
        if (symbols.length) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const token_1 = new ethers.Contract(config[chainId][symbols[0]].address, TOKEN_ABI, provider);
            const token_2 = new ethers.Contract(config[chainId][symbols[1]].address, TOKEN_ABI, provider);
            setTokenPair({ token_1, token_2 });
        }
    }, [symbols]);

    const handleCancel = id => {
        dispatch(cancelOrder(exchange, id));
    }

    const clickHandler = ref => {
        if (ref === 'order') {
            orderBtn.current.className = 'tab tab--active';
            txBtn.current.className = 'tab';
            setShowMyOrders(true);
        } else {
            orderBtn.current.className = 'tab';
            txBtn.current.className = 'tab tab--active';
            setShowMyOrders(false);
        }
    }

    let orderTable, txTable;
    if (orders) {
        orderTable = orders.map((order, i) => {
            const isBuy = order.tokenPriceClass === 'green';
            return (
                <tr key={i}>
                    <td className={order.tokenPriceClass}>
                        {isBuy ? order.amountGet : order.amountGive}
                    </td>
                    <td>{order.tokenPrice}</td>
                    <td>
                        <button className='button--sm' onClick={() => handleCancel(order.id)}>
                            Cancel
                        </button>
                    </td>
                </tr>
            )
        });
    }
    if (transactions) {
        txTable = transactions.map((tx, i) => {
            const isBuy = tx.tokenPriceClass === 'green';
            return (
                <tr key={i}>
                    <td>{tx.dateTime}</td>
                    <td className={tx.tokenPriceClass}>
                        {isBuy ? tx.amountGet : tx.amountGive}
                    </td>
                    <td>{tx.tokenPrice}</td>
                </tr>
            )
        });
    }

    return (
        <div className="component exchange__transactions">
            {showMyOrders ?
                <div>
                    <div className='component__header flex-between'>
                        <h2>My Orders</h2>

                        <div className='tabs'>
                            <button
                                ref={orderBtn}
                                onClick={() => clickHandler('order')}
                                className='tab tab--active'
                            >
                                Orders
                            </button>
                            <button
                                ref={txBtn}
                                onClick={() => clickHandler('tx')}
                                className='tab'
                            >
                                Trades
                            </button>
                        </div>
                    </div>

                    {orders ?
                        <table>
                            <thead>
                                <tr>
                                    <th>Amount<img src={sort} alt='' /></th>
                                    <th>Price<img src={sort} alt='' /></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderTable}
                            </tbody>
                        </table>
                        :
                        <Banner text='No Open Orders' />
                    }

                </div>
                :
                <div>
                    <div className='component__header flex-between'>
                        <h2>My orders</h2>

                        <div className='tabs'>
                            <button
                                ref={orderBtn}
                                onClick={() => clickHandler('order')}
                                className='tab tab--active'
                            >
                                Orders
                            </button>
                            <button
                                ref={txBtn}
                                onClick={() => clickHandler('tx')}
                                className='tab'
                            >
                                Trades
                            </button>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Time<img src={sort} alt='' /></th>
                                <th>Amount<img src={sort} alt='' /></th>
                                <th>Price<img src={sort} alt='' /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {txTable}
                        </tbody>
                    </table>

                </div>
            }
        </div>
    )
}
