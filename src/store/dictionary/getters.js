export default {
    wholeDictionary(state) {
        return state.dictionary;
    },
    currency(state) {
        return state.dictionary.currency;
    },
    dividend(state) {
        return state.dictionary.dividend;
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
};