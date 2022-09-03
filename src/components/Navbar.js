import React from 'react';
import { ethers } from 'ethers';
import logo from '../assets/logo.png';
import eth from '../assets/eth.svg';
import { useDispatch, useSelector } from 'react-redux';
import { loadAccount } from '../redux/providerSlice';
import metamask from '../assets/metamask.svg';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

export default function Navbar() {

    const dispatch = useDispatch();
    const provider = useSelector(state => state.provider);

    const [network, setNetwork] = React.useState('');

    let truncatedAcc, roundedBalance;
    if (provider.account) {
        const { account, balance } = provider;
        truncatedAcc = account.slice(0, 5) + '...' + account.slice(account.length - 4);
        roundedBalance = Number(balance).toFixed(4);
    }

    const renderSelect = value => {
        return (
            <Box sx={{ display: "flex", gap: 2 }}>
                <img src={eth} alt='' className='icon-eth' />
                <span>{value}</span>
            </Box>
        )
    }

    const selectHandler = event => {
        setNetwork(event.target.value);
    }

    const connectHandler = () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        dispatch(loadAccount(provider));
    }

    return (
        <div className='exchange__header grid'>
            <div className='exchange__header--brand flex'>
                <img src={logo} className='logo' alt='NEX logo' />
                <h1>NEXchange</h1>
            </div>
            <div className='exchange__header--networks flex'>
                <FormControl fullWidth>
                    <InputLabel>Network</InputLabel>
                    <Select
                        label='Network'
                        value={network}
                        renderValue={value => renderSelect(value)}
                        onChange={selectHandler}
                    >
                        <MenuItem value='rinkeby'>Rinkeby</MenuItem>
                        <MenuItem value='localhost'>LocalHost</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className='exchange__header--account flex'>
                <p>
                    <small>Balance</small>
                    {provider.account ? <span>{roundedBalance}</span> : <span>******</span>}
                    <small>ETH</small>
                </p>
                {
                    provider.account ?
                        <a href='#'>
                            {truncatedAcc}
                            <img src={metamask} alt='' />
                        </a>
                        :
                        <button className='button' onClick={connectHandler}>Connect</button>
                }
            </div>
        </div>
    )
}
