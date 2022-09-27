import React from 'react';
import { ethers } from 'ethers';
import config from '../config/chains.json';
import TOKEN_ABI from '../abi/Token.json';
import Banner from './subComponents/Banner';
import ReactApexChart from 'react-apexcharts';
import { options, series } from '../config/priceChartConfig';
import downArrow from '../assets/down-arrow.svg';
import upArrow from '../assets/up-arrow.svg';
import { useSelector } from 'react-redux';
import { priceChartSelector } from '../redux/selectors';

export default function PriceChart() {

    const [tokenPair, setTokenPair] = React.useState();

    const { account, chainId } = useSelector(state => state.provider);
    const symbols = useSelector(state => state.tokens.symbols);
    const priceChart = useSelector(state => priceChartSelector(state, tokenPair));

    React.useEffect(() => {
        if (symbols.length) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const token_1 = new ethers.Contract(config[chainId][symbols[0]].address, TOKEN_ABI, provider);
            const token_2 = new ethers.Contract(config[chainId][symbols[1]].address, TOKEN_ABI, provider);
            setTokenPair({ token_1, token_2 });
        }
    }, [symbols, account]);

    if (priceChart) {
        console.log(priceChart)
    }

    return (
        <div className="component exchange__chart">
            <div className='component__header flex-between'>
                <div className='flex'>

                    <h2>{symbols.length && `${symbols[0]} / ${symbols[1]}`}</h2>

                    {priceChart &&
                        <div className='flex'>
                            <img src={priceChart.lastPriceChange === '+' ? upArrow : downArrow} alt="" />
                            <span className='up'>{priceChart.lastPrice}</span>
                        </div>
                    }

                </div>
            </div>

            {account ?
                <ReactApexChart
                    type='candlestick'
                    options={options}
                    series={priceChart ? priceChart.series : []}
                    width='100%'
                    height='100%'
                /> :
                <Banner text='Please connect with MetaMask' />
            }

        </div>
    )
}
