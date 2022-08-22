export default {
    allIndexes(state) {
        return state.indexes;
    },
    dividendChart(state) {
        return state.indexes.dividendChart;
    },
    deposits(state) {
        return state.indexes.deposits;
    },
    transactions(state) {
        return state.indexes.transactions;
    },
    tradingVolume(state) {
        return state.indexes.tradingVolume;
    },
    exchangeFees(state) {
        return state.indexes.exchangeFees;
    },
    tradingFrequency(state) {
        return state.indexes.tradingFrequency;
    },
    portfolio(state) {
        return state.indexes.portfolio;
    },
    profitLossTransactionsIndexes(state) {
        return state.indexes.profitLossTransactionsIndexes;
    },
    accountStatement(state) {
        return state.indexes.accountStatement;
    }
    
};