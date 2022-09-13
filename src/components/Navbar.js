import React from 'react';
import { ethers } from 'ethers';
import config from '../config/chains.json';
import logo from '../assets/logo.png';
import eth from '../assets/eth.svg';
import { useDispatch, useSelector } from 'react-redux';
import { loadAccount, setChainId } from '../redux/providerSlice';
import metamask from '../assets/metamask.svg';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

export default function Navbar() {

    const dispatch = useDispatch();

    const provider = useSelector(state => state.provider);
    const chainId = useSelector(state => state.provider.chainId);

    let truncatedAcc, roundedBalance;
    if (provider.account) {
        const { account, balance } = provider;
        truncatedAcc = account.slice(0, 5) + '...' + account.slice(account.length - 4);
        roundedBalance = Number(balance).toFixed(4);
        console.log(`${config[chainId].etherscan}/${provider.account}`)
    }

    const renderSelect = value => {
        let networkName;
        switch (value) {
            case '0x5':
                networkName = 'Goerli';
                break;
            case '0x7a69':
                networkName = 'Localhost'
                break;
        }
        return (
            <Box sx={{ display: "flex" }}>
                <img src={eth} alt='' className='icon-network' />
                <span>{networkName}</span>
            </Box>
        )
    }

    const selectHandler = async event => {
        const chainId = event.target.value;

        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId }]
        });
        // console.log(event.target.value);
    }

    const connectHandler = () => {
        dispatch(loadAccount()); // disable connect button while loading
    }

    return (
        <div className='exchange__header grid'>
            <div className='exchange__header--brand flex'>
                <img src={logo} className='logo' alt='NEX logo' />
                <h1>NEXchange</h1>
            </div>
            <div className='exchange__header--networks flex'>
                <FormControl>
                    <InputLabel>Network</InputLabel>
                    <Select
                        label='Network'
                        value={config[chainId] ? `0x${chainId.toString(16)}` : ''}
                        renderValue={value => renderSelect(value)}
                        onChange={selectHandler}
                    >
                        <MenuItem value='0x5'>
                            <img src={eth} alt='' className='icon-network' />
                            <div>Goerli</div>
                        </MenuItem>
                        <MenuItem value='0x7a69'>
                            <img src={eth} alt='' className='icon-network' />
                            <span>Localhost</span>
                        </MenuItem>
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
                        <a
                            href={config[chainId] ? `${config[chainId].etherscan}/${provider.account}`: '#'}
                            target='_blank'
                        >
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
