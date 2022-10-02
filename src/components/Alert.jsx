import React from 'react';
import { useSelector } from 'react-redux';
import { myEventSelector } from '../redux/selectors';
import config from '../config/chains.json';

export default function Alert() {

    const { chainId, account } = useSelector(state => state.provider);
    const { isPending, isSuccessful, isError } = useSelector(state => state.exchange.transaction);
    const myEvent = useSelector(state => myEventSelector(state, account));

    const alertRef = React.useRef(null);

    React.useEffect(() => {
        if (isPending) {
            alertRef.current.className = 'alert';
        } else if (isSuccessful || isError) {
            setTimeout(() => {
                alertRef.current.className = 'alert alert--remove';
            }, 3000);
        }
    }, [isPending, isSuccessful, isError]);

    let txLink, truncatedHash;
    if (myEvent) {
        const { txHash } = myEvent;
        txLink = config[chainId].etherscan + '/tx/' + txHash;
        truncatedHash = txHash.slice(0, 6) + '...' + txHash.slice(txHash.length - 5);
    }

    return (
        <div>
            <div ref={alertRef} className="alert alert--remove">
                {isPending && <h1>Transaction Pending...</h1>}
                {isSuccessful &&
                    <>
                        <h1>Transaction Successful</h1>
                        <a href={txLink} target='_blank' rel='noreferrer'>
                            {truncatedHash}
                        </a>
                    </>
                }
                {isError && <h1>Transaction Failed</h1>}
            </div>
        </div>
    )
}
