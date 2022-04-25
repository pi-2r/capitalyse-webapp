export default {
    getFiles(state) {
        return {
            transactionsFile: state.transactionsFile,
            accountFile: state.accountFile,
        };
    },
    transactionsFile(state) {
        return state.transactionsFile;
    },
    accountFile(state) {
        return state.accountFile;
    },
    hasFiles(state) {
        return !!state.accountFile && !!state.transactionsFile;
    },
    
};