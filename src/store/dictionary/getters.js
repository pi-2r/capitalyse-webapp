export default {
    wholeDictionary(state) {
        return state.dictionary;
    },
    currency(state) {
        return state.dictionary.currency;
    },
    dividendEUR(state) {
        return state.dictionary.dividendEUR;
    },
    deposit(state) {
        return state.dictionary.deposit;
    },
    exchangeFees(state) {
        return state.dictionary.exchangeFees;
    },
    withdrawal(state) {
        return state.dictionary.withdrawal;
    },
    failedDeposit(state) {
        return state.dictionary.failedDeposit;
    },
    portfolioCash(state) {
        return state.dictionary.portfolioCash;
    },
    currencyChange(state) {
        return state.dictionary.currencyChange;
    },
    buy(state) {
        return state.dictionary.buy;
    }
};