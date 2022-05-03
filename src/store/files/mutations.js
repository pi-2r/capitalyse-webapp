export default {
    setPortfolios(state, portfolios) {
        state.portfolios = portfolios;
    },
    setCurrentPortfolio(state, id) {
        for (let i = 0; i < state.portfolios.length; i++) {
            if (state.portfolios[i].id === id) {
                state.currentPortfolio = state.portfolios[i];
                return;
            }
        }
    },
    resetCurrentPortfolio(state) {
        state.currentPortfolio = null;
    },
    setTransactionsFile(state, {transactionsFile, portfolioId}) {
        state.portfolios = state.portfolios.map(portfolio => {
            if (portfolio.id === portfolioId) {
                portfolio.transactionsFile = transactionsFile;
            }
            return portfolio;
        });
    },
    setAccountFile(state, {accountFile, portfolioId}) {
        state.portfolios = state.portfolios.map(portfolio => {
            if (portfolio.id === portfolioId) {
                portfolio.accountFile = accountFile;
            }
            return portfolio;
        });
    },
    setUploadingState(state, uploadingState) {
        state.uploadingState = uploadingState;
    },
    resetPortfolios(state) {
        state.portfolios = [];
    },
    setUpdatedPortfolioName(state, { portfolioId, portfolioName }) {
        state.portfolios = state.portfolios.map(portfolio => {
            if (portfolio.id === portfolioId) {
                portfolio.portfolioName = portfolioName;
            }
            return portfolio;
        });
    },
    deletePortfolio(state, id) {
        state.portfolios = state.portfolios.filter(p => p.id !== id);
    },
};