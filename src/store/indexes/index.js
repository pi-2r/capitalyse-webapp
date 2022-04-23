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
                transactions: {
                    
                }
            },
        };
    },
    getters,
};
