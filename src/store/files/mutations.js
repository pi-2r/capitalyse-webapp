export default {
    setFiles(state, { transactionsFile, accountFile }) {
        state.transactionsFile = transactionsFile;
        state.accountFile = accountFile;
    },
    setTransactionsFile(state, transactionsFile) {
        state.transactionsFile = transactionsFile;
    },
    setAccountFile(state, accountFile) {
        state.accountFile = accountFile;
    }
};