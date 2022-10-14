import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { ethers } from "ethers";
import TOKEN_ABI from '../abi/Token.json';
import config from '../config/chains.json';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { loadTokens } from "../redux/tokenSlice";

export default function Markets(props) {

    const { setIsSwap } = props;
    const dispatch = useDispatch();

    const chainId = useSelector(state => state.provider.chainId);

    const [pair, setPair] = React.useState('Base Tokens');

    let NXP_mETH, NXP_mDAI;
    if (config[chainId]) {
        const { NXP, mETH, mDAI } = config[chainId];
        NXP_mETH = `${NXP.address},${mETH.address}`;
        NXP_mDAI = `${NXP.address},${mDAI.address}`;
    }

    const selectHandler = async e => {
        setPair(e.target.value);
        if (e.target.value === 'Base Tokens') {
            setIsSwap(true);
        } else {
            setIsSwap(false);
            const [address_1, address_2] = (e.target.value).split(',');
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const token_1 = new ethers.Contract(address_1, TOKEN_ABI, provider);
            const token_2 = new ethers.Contract(address_2, TOKEN_ABI, provider);
            dispatch(loadTokens(token_1, token_2));
        }
    }

    return (
        <div className='component exchange__markets'>
            <div className='component__header'>
                <h2>Select Trading Pair</h2>
            </div>
            <FormControl fullWidth>
                <Select
                    value={pair}
                    onChange={selectHandler}
                    sx={{ width: '100%' }}
                >
                    <MenuItem value='Base Tokens'>
                        Base Tokens
                    </MenuItem>
                    <MenuItem value={NXP_mETH}>
                        NXP / mETH
                    </MenuItem>
                    <MenuItem value={NXP_mDAI}>
                        NXP / mDAI
                    </MenuItem>
                </Select>
            </FormControl>
            <hr />
        </div>
    )
}
