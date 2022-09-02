import React from 'react';
import { useSelector } from 'react-redux';
import logo from '../assets/logo.png'
import metamask from '../assets/metamask.svg';

export default function Navbar() {

    const provider = useSelector(state => state.provider);

    let truncatedAcc, roundedBalance;
    if (provider.account) {
        const { account, balance } = provider;
        truncatedAcc = account.slice(0, 5) + '...' + account.slice(account.length - 4);
        roundedBalance = Number(balance).toFixed(4);
    }

    return (
        <div className='exchange__header grid'>
            <div className='exchange__header--brand flex'>
                <img src={logo} className='logo' alt='NEX logo' />
                <h1>NEXchange</h1>
            </div>

            <div className='exchange__header--networks flex'>

            </div>

            <div className='exchange__header--account flex'>
                <p>
                    <small>Balance</small>
                    <span>{roundedBalance}</span>
                    <small>ETH</small>
                </p>
                <a href=''>
                    {truncatedAcc}
                    <img src={metamask} alt='' />
                </a>
            </div>
        </div>
    )
}
