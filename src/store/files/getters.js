export default {
    getPortfolios(state) {
        return state.portfolios;
    },
    getCurrentPortfolio(state) {
        return state.currentPortfolio;
    },
    getCurrentPortfolioName(state) {
        return state.currentPortfolio.portfolioName;
    },
    hasPortfolios(state) {
        return state.portfolios.length > 0;
    },
    amountOfPortfolios(state) {
        return state.portfolios.length;
    },
    hasCurrentPortfolio(state, payload) {
        return state.portfolios.some(p => p.id === payload.portfolioId);
    },
    hasCurrentFiles(state, payload) {
        // check if files are uploaded for a specific portfolio
        if (payload) {
            for (let i = 0; i < state.portfolios.length; i++) {
                if (state.portfolios[i].id === payload.portfolioId) {
                    return !!state.portfolios[i].transactionsFile && !!state.portfolios[i].accountFile;
                }
            }
        }
    },
    getUploadingState(state) {
        return state.uploadingState;
    },
};