import { createDraftSafeSelector } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

const tokenPair = (_, tokenPair) => tokenPair;
const orders = state => state.exchange.orders;

const openOrders = state => {
    const { orders, cancelledOrders, filledOrders } = state.exchange;
    const openOrders = orders.filter(order => {
        const cancelledOrder = cancelledOrders.filter(o => o.id === order.id);
        const filledOrder = filledOrders.filter(o => o.id === order.id);
        if (!cancelledOrder.length && !filledOrder.length) {
            return true;
        }
    });
    return openOrders;
}

const processOrders = (orders, isBuy) => {
    const processedOrders = orders.map(order => ({
        ...order,
        orderType: isBuy ? 'buy' : 'sell',
        orderTypeClass: isBuy ? 'green' : 'red',
        orderFillAction: isBuy ? 'sell' : 'buy',
        tokenPrice: (order.amountGive / order.amountGet).toFixed(2),
        dateTime: DateTime.fromSeconds(order.timestamp).toLocaleString(DateTime.DATETIME_SHORT)
    }));
    processedOrders.sort((a, b) => {
        if (isBuy) {
            return a.tokenPrice - b.tokenPrice;
        } else {
            return b.tokenPrice - a.tokenPrice;
        }
    });
    return processedOrders;
}

export const buyOrderSelector = createDraftSafeSelector(
    openOrders,
    tokenPair,
    (orders, tokenPair) => {
        if (tokenPair) {
            const { token_1, token_2 } = tokenPair;
            const buyOrders = orders.filter(order => {
                const { tokenGet, tokenGive } = order;
                if (tokenGet === token_1.address && tokenGive === token_2.address) {
                    return true;
                }
            });
            const processedBuyOrders = processOrders(buyOrders, true);
            return processedBuyOrders;
        }
    }
);

export const sellOrderSelector = createDraftSafeSelector(
    openOrders,
    tokenPair,
    (orders, tokenPair) => {
        if (tokenPair) {
            const { token_1, token_2 } = tokenPair;
            const sellOrders = orders.filter(order => {
                const { tokenGet, tokenGive } = order;
                if (tokenGet === token_2.address && tokenGive === token_1.address) {
                    return true;
                }
            });
            const processedSellOrders = processOrders(sellOrders, false);
            return processedSellOrders;
        }
    }
);
