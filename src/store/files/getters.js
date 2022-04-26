export default {
    getFiles(state) {
        return {
            transactionsFile: state.transactionsFile,
            accountFile: state.accountFile,
        };
    },
    getPortfolios(state) {
        return state.portfolios;
    },
    hasPortfolios(state) {
        return state.portfolios.length > 0;
    },
    getDashboardPortfolio(state) {
        return state.currentPortfolio;
    },
    hasDashboardPortoflio(state) {
        return state.currentPortfolio !== null;
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