import React from 'react';
import { useSelector } from 'react-redux';
import { myEventSelector } from '../redux/selectors';

export default function Alert() {

    const { account } = useSelector(state => state.provider);
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

    const truncateHash = hash => {
        return hash.slice(0, 6) + '...' + hash.slice(hash.length - 5);
    }

    return (
        <div>
            <div ref={alertRef} className="alert alert--remove">
                {isPending && <h1>Transaction Pending...</h1>}
                {isSuccessful &&
                    <>
                        <h1>Transaction Successful</h1>
                        <a href='' target='_blank' rel='noreferrer'>
                            {myEvent && truncateHash(myEvent.txHash)}
                        </a>
                    </>
                }
                {isError && <h1>Transaction Failed</h1>}
            </div>
        </div>
    )
}
