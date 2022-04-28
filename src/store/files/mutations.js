export default {
    setPortfolios(state, portfolios) {
        state.portfolios = portfolios;
    },
    setDashboardPortfolio(state, portfolio) {
        state.dashboardPortfolio = portfolio;
    },
    setFiles(state, { transactionsFile, accountFile }) {
        state.transactionsFile = transactionsFile;
        state.accountFile = accountFile;
    },
    setTransactionsFile(state, transactionsFile) {
        state.transactionsFile = transactionsFile;
    },
    setAccountFile(state, accountFile) {
        state.accountFile = accountFile;
    },
    setUploadingState(state, uploadingState) {
        state.uploadingState = uploadingState;
    },
    resetFiles(state) {
        state.transactionsFile = null;
        state.accountFile = null;
    },
    resetPortfolios(state) {
        state.portfolios = [];
    },
    deletePortfolio(state, portfolio) {
        state.portfolios = state.portfolios.filter(p => p.id !== portfolio.id);
    }
};