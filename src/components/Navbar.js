import React from 'react';
import { useSelector } from 'react-redux';
import logo from '../assets/logo.png'

export default function Navbar() {

    const account = useSelector(state => state.provider.account);

    return (
        <div className='exchange__header grid'>
            <div className='exchange__header--brand flex'>
                <img src={logo} className='logo' alt='NEX logo' />
                <h1>NEXchange</h1>
            </div>

            <div className='exchange__header--networks flex'>

            </div>

            <div className='exchange__header--account flex'>
                <div>{account}</div>
            </div>
        </div>
    )
}
