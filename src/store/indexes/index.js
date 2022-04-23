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
                    searchIndex: 5,
                    depositIndex: 8,
                },
                transactions: {
                    searchIndex: 14,
                },
                tradingVolume: {
                    searchIndex: 16,
                },
            },
        };
    },
    getters,
};
