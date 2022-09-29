import React from 'react';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import config from '../config/chains.json';
import TOKEN_ABI from '../abi/Token.json';
import { filledOrderSelector } from '../redux/selectors';
import sort from '../assets/sort.svg';

export default function Trades() {

    const [tokenPair, setTokenPair] = React.useState();

    const { chainId } = useSelector(state => state.provider);
    const symbols = useSelector(state => state.tokens.symbols);
    const filledOrders = useSelector(state => filledOrderSelector(state, tokenPair));

    React.useEffect(() => {
        if (symbols.length) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const token_1 = new ethers.Contract(config[chainId][symbols[0]].address, TOKEN_ABI, provider);
            const token_2 = new ethers.Contract(config[chainId][symbols[1]].address, TOKEN_ABI, provider);
            setTokenPair({ token_1, token_2 });
        }
    }, [symbols]);

    let tradesTable;
    if (filledOrders) {
        tradesTable = filledOrders.map((order, i) => {
            const isBuy = order.tokenPriceClass === 'green';
            return (
                <tr key={i}>
                    <td>{order.dateTime}</td>
                    <td className={order.tokenPriceClass}>
                        {isBuy ? order.amoutGet : order.amountGive}
                    </td>
                    <td>{order.tokenPrice}</td>
                </tr>
            )
        });
    }

    return (
        <div className="component exchange__trades">
            <div className='component__header flex-between'>
                <h2>Trades</h2>
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
                    {tradesTable}
                </tbody>
            </table>

        </div>
    )
}
