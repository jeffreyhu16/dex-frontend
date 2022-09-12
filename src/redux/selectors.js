import { createDraftSafeSelector } from '@reduxjs/toolkit';

const orders = state => state.exchange.orders;
const tokenPair = (_, tokenPair) => tokenPair;

export const orderBookSelector = createDraftSafeSelector(
    orders,
    tokenPair,
    async (orders, tokenPair) => {
        if (tokenPair) {
            const { token_1, token_2 } = tokenPair;
            const buyOrders = orders.filter(order => {
                const { tokenGet, tokenGive } = order;
                if (tokenGet === token_1.address && tokenGive === token_2.address) {
                    return true;
                }
            });
            const sellOrders = orders.filter(order => {
                const { tokenGet, tokenGive } = order;
                if (tokenGet === token_2.address && tokenGive === token_1.address) {
                    return true;
                }
            });
        }
    }
);
