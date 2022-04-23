export default {
    setFiles(state, { transactionsFile, accountFile }) {
        state.transactionsFile = transactionsFile;
        state.accountFile = accountFile;
    },
};