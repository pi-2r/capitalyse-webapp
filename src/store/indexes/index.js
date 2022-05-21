import getters from "./getters";

export default {
    namespaced: true,
    state() {
        return {
            indexes: {
                dividendChart: {
                    searchIndex: 5,
                    dateIndex: 0,
                    dividendIndex: 8,
                    currencyIndex: 7,
                    productIndex: 3,
                },
                deposits: {
                    dateIndex: 0,
                    searchIndex: 5,
                    depositIndex: 8,
                },
                transactions: {
                    searchIndex: 14,
                },
                tradingVolume: {
                    searchIndex: 16,
                    currencyIndex: 17,
                },
                exchangeFees: {
                    searchIndex: 5,
                    feeIndex: 8,
                },
                tradingFrequency: {
                    searchIndex: 2,
                    buyOrSellIndex: 6,
                },
                portfolio: {
                    productIndex: 0,
                    isinIndex: 1,
                    amountIndex: 2,
                    priceIndex: 3,
                    localCurrencyIndex: 4,
                    eurTotalIndex: 5,
                },
                profitLossTransactionsIndexes: {
                    eurAmount: 16,
                },
            },
        };
    },
    getters,
};
