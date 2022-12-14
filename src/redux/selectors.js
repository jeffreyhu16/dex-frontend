import { createDraftSafeSelector } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';
import { groupBy, maxBy, minBy } from 'lodash';

const account = (_, __, account) => account;
const tokenPair = (_, tokenPair) => tokenPair;
const filledOrders = state => state.exchange.filledOrders;

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

const processpOpenOrders = (orders, isBuy) => {
    const processedOrders = orders.map(order => {
        const tokenPrice = isBuy ? (order.amountGive / order.amountGet) : (order.amountGet / order.amountGive);
        return {
            ...order,
            orderType: isBuy ? 'buy' : 'sell',
            orderTypeClass: isBuy ? 'green' : 'red',
            orderFillAction: isBuy ? 'sell' : 'buy',
            tokenPrice: tokenPrice.toFixed(2),
            dateTime: DateTime.fromSeconds(order.timestamp).toLocaleString(DateTime.DATETIME_SHORT)
        }
    });
    processedOrders.sort((a, b) => {
        if (isBuy) {
            return a.tokenPrice - b.tokenPrice;
        } else {
            return b.tokenPrice - a.tokenPrice;
        }
    });
    return processedOrders;
}

const processFilledOrders = (orders) => {
    const processedOrders = orders.map((order) => {
        const tokenPrice =
            order.tokenPriceClass === 'green' ?
                (order.amountGive / order.amountGet) :
                (order.amountGet / order.amountGive);
        return {
            ...order,
            tokenPrice: tokenPrice.toFixed(2),
            dateTime: DateTime.fromSeconds(order.timestamp).toLocaleString(DateTime.DATETIME_SHORT)
        }
    });
    processedOrders.sort((a, b) => b.timestamp - a.timestamp);
    return processedOrders
}

const processMyOrders = (orders) => {
    const processedOrders = orders.map((order) => {
        const tokenPrice =
            order.tokenPriceClass === 'green' ?
                (order.amountGive / order.amountGet) :
                (order.amountGet / order.amountGive);
        return {
            ...order,
            tokenPrice: tokenPrice.toFixed(2),
            dateTime: DateTime.fromSeconds(order.timestamp).toLocaleString(DateTime.DATETIME_SHORT)
        }
    });
    processedOrders.sort((a, b) => a.timestamp - b.timestamp);
    return processedOrders
}

const processMyTxs = (orders) => {
    const processedOrders = orders.map((order) => {
        const priceCondition =
            order.isMaker ?
                order.tokenPriceClass === 'green' :
                order.tokenPriceClass === 'red';
        const tokenPrice =
            priceCondition ?
                (order.amountGive / order.amountGet) :
                (order.amountGet / order.amountGive);
        return {
            ...order,
            tokenPrice: tokenPrice.toFixed(2),
            dateTime: DateTime.fromSeconds(order.timestamp).toLocaleString(DateTime.DATETIME_SHORT)
        }
    });
    processedOrders.sort((a, b) => a.timestamp - b.timestamp);
    return processedOrders
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
            const processedBuyOrders = processpOpenOrders(buyOrders, true);
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
            const processedSellOrders = processpOpenOrders(sellOrders, false);
            return processedSellOrders;
        }
    }
);

export const filledOrderSelector = createDraftSafeSelector(
    filledOrders,
    tokenPair,
    (orders, tokenPair) => {
        if (tokenPair) {
            const { token_1, token_2 } = tokenPair;
            const tokenPairOrders = [];
            orders.forEach(order => {
                const { tokenGet, tokenGive } = order;
                const buyCondition = (tokenGet === token_1.address && tokenGive === token_2.address);
                const sellCondition = (tokenGet === token_2.address && tokenGive === token_1.address);
                if (buyCondition || sellCondition) {
                    tokenPairOrders.push({
                        ...order,
                        tokenPriceClass: buyCondition ? 'green' : 'red'
                    });
                }
            });
            const processedFilledOrders = processFilledOrders(tokenPairOrders);
            return processedFilledOrders;
        }
    }
);

export const myOpenOrdersSelector = createDraftSafeSelector(
    openOrders,
    tokenPair,
    account,
    (orders, tokenPair, account) => {
        if (tokenPair) {
            const { token_1, token_2 } = tokenPair;
            const myOrders = [];
            orders.forEach(order => {
                const myOrder = order.user === account;
                const { tokenGet, tokenGive } = order;
                const buyCondition = (tokenGet === token_1.address && tokenGive === token_2.address);
                const sellCondition = (tokenGet === token_2.address && tokenGive === token_1.address);
                if (myOrder && (buyCondition || sellCondition)) {
                    console.log(buyCondition)
                    myOrders.push({
                        ...order,
                        tokenPriceClass: buyCondition ? 'green' : 'red'
                    });
                }
            });
            const processedMyOrders = processMyOrders(myOrders);
            return processedMyOrders;
        }
    }
);

export const myTxSelector = createDraftSafeSelector(
    filledOrders,
    tokenPair,
    account,
    (tx, tokenPair, account) => {
        if (tokenPair) {
            const { token_1, token_2 } = tokenPair;
            const myTxs = [];
            tx.forEach(tx => {
                const { tokenGet, tokenGive } = tx;
                const maker = tx.creator === account;
                const taker = tx.user === account;
                const buyCondition = (tokenGet === token_1.address && tokenGive === token_2.address);
                const sellCondition = (tokenGet === token_2.address && tokenGive === token_1.address);
                if ((maker || taker) && (buyCondition || sellCondition)) {
                    const condition = maker ? buyCondition : sellCondition;
                    myTxs.push({
                        ...tx,
                        isMaker: maker,
                        tokenPriceClass: condition ? 'green' : 'red'
                    });
                }
            });
            const processedMyTxs = processMyTxs(myTxs);
            return processedMyTxs;
        }
    }
);

export const myEventSelector = createDraftSafeSelector(
    state => state.exchange.events,
    (_, account) => account,
    (events, account) => {
        if (account) {
            const myEvents = events.filter(event => event.user === account);
            return myEvents[0];
        }
    }
);

export const priceChartSelector = createDraftSafeSelector(
    filledOrders,
    tokenPair,
    (orders, tokenPair) => {
        if (orders.length && tokenPair) {
            const { token_1, token_2 } = tokenPair;
            const tokenPairOrders = orders.filter(order => {
                const { tokenGet, tokenGive } = order;
                const buyCondition = (tokenGet === token_1.address && tokenGive === token_2.address);
                const sellCondition = (tokenGet === token_2.address && tokenGive === token_1.address);
                if (buyCondition || sellCondition) {
                    return true;
                }
            });
            const processedFilledOrders = processFilledOrders(tokenPairOrders);
            const lastOrder = processedFilledOrders[processedFilledOrders.length - 1];
            const secondLastOrder = processedFilledOrders[processedFilledOrders.length - 2];
            const lastPrice = lastOrder.tokenPrice;
            const secondLastPrice = secondLastOrder.tokenPrice;
            return {
                lastPrice,
                lastPriceChange: (lastPrice > secondLastPrice ? '+' : '-'),
                series: [{
                    data: buildGraphData(processedFilledOrders)
                }]
            }
        }
    }
);

const buildGraphData = orders => {
    const groupedOrders = groupBy(orders, order => DateTime.fromSeconds(order.timestamp).startOf('hour').toISO());
    const hours = Object.keys(groupedOrders);

    const graphData = hours.map(hour => {
        const hourGroup = groupedOrders[hour];
        const open = hourGroup[0];
        const high = maxBy(hourGroup, 'tokenPrice');
        const low = minBy(hourGroup, 'tokenPrice');
        const close = hourGroup[hourGroup.length - 1];
        return {
            x: hour,
            y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice]
        }
    });
    return graphData;
}
