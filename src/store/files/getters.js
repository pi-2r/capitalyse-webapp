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
        return state.portfolios.length;
    },
    amountOfPortfolios(state) {
        return state.portfolios.length;
    },
    hasCurrentPortfolio(state, payload) {
        return state.portfolios.some(p => p.id === payload.portfolioId);
    },
    hasCurrentFiles(state, payload) {
        if (payload) {
            for (let i = 0; i < state.portfolios.length; i++) {
                if (state.portfolios[i].id === payload.portfolioId) {
                    return !!state.portfolios[i].transactionsFile && !!state.portfolios[i].accountFile && !!state.portfolios[i].portfolioFile;
                }
            }
        }
    },
    getUploadingState(state) {
        return state.uploadingState;
    },
    getAnalytics(state) {
        return state.analytics;
    },
    getDemo(state) {
        return state.demoAnalytics;
    },
    getDemoPortfolioInfo(state) {
        return state.demoPortfolio[0]
    },
};