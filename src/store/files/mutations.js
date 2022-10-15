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
    setDemoAsCurrentPortfolio(state) {
        state.currentPortfolio = state.demoCurrentPortfolio;
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
    setPortfolioFile(state, { portfolioFile, portfolioId }) {
        state.portfolios = state.portfolios.map(portfolio => {
            if (portfolio.id === portfolioId) {
                portfolio.portfolioFile = portfolioFile;
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
    resetDataState(state) {
        state.portfolios = [];
        state.currentPortfolio = null;
        state.uploadingState = null;
    },
    setAnalytics(state, { data, portfolioId, analyticsType, isin }) {
        let alrExists = false;
        for (let i = 0; i < state.analytics.length; i++) {
            const portfolio = state.analytics[i];
            // kijk of portfolioid al bestaat
            if (Object.keys(portfolio).includes(portfolioId)) {
                let typeAnalytics;
                analyticsType === 'home' ? typeAnalytics = state.analytics[i][portfolioId].homeAnalytics : null;
                analyticsType === 'trading' ? typeAnalytics = state.analytics[i][portfolioId].tradingAnalytics : null;
                analyticsType === 'deposits' ? typeAnalytics = state.analytics[i][portfolioId].depositsAnalytics : null;
                analyticsType === 'fees' ? typeAnalytics = state.analytics[i][portfolioId].feesAnalytics : null;
                analyticsType === 'holdings' && isin !== undefined ? typeAnalytics = state.analytics[i][portfolioId].holdingAnalytics : null;
                analyticsType === 'holdings' && isin === undefined ? typeAnalytics = state.analytics[i][portfolioId].holdingsAnalytics : null;
                
                // append nieuwe analytics
                if (!typeAnalytics && isin === undefined) {
                    state.analytics[i][portfolioId] = { ...state.analytics[i][portfolioId], ...data }
                }
                // one holding analytics
                if (analyticsType === 'holdings' && isin !== undefined) {
                    state.analytics[i][portfolioId].holdingAnalytics = { ...state.analytics[i][portfolioId].holdingAnalytics, ...{ [isin]: data } }
                }
                alrExists = true
            }
        }
       
        if (!alrExists && isin === undefined) {
            state.analytics.push({
                [portfolioId]: data,
            });
        } else if (!alrExists && analyticsType === 'holdings' && isin !== undefined) {
            state.analytics.push({ [portfolioId]: { holdingAnalytics: { [isin]: data } }})
            // state.analytics.holdingAnalytics.push({
            //     [portfolioId]: { [isin]: data },
            // })
        }
    }, 
    setSharedAnalytics(state, { data, portfolioId, analyticsType, isin }) {
        let alrExists = false;
        for (let i = 0; i < state.sharedAnalytics.length; i++) {
            const portfolio = state.sharedAnalytics[i];
            // kijk of portfolioid al bestaat
            if (Object.keys(portfolio).includes(portfolioId)) {
                let typeAnalytics;
                analyticsType === 'home' ? typeAnalytics = state.sharedAnalytics[i][portfolioId].homeAnalytics : null;
                analyticsType === 'trading' ? typeAnalytics = state.sharedAnalytics[i][portfolioId].tradingAnalytics : null;
                analyticsType === 'deposits' ? typeAnalytics = state.sharedAnalytics[i][portfolioId].depositsAnalytics : null;
                analyticsType === 'fees' ? typeAnalytics = state.sharedAnalytics[i][portfolioId].feesAnalytics : null;
                analyticsType === 'holdings' && isin !== undefined ? typeAnalytics = state.sharedAnalytics[i][portfolioId].holdingAnalytics : null;
                analyticsType === 'holdings' && isin === undefined ? typeAnalytics = state.sharedAnalytics[i][portfolioId].holdingsAnalytics : null;

                // append nieuwe analytics
                if (!typeAnalytics && isin === undefined) {
                    state.sharedAnalytics[i][portfolioId] = { ...state.sharedAnalytics[i][portfolioId], ...data }
                }
                // one holding analytics
                if (analyticsType === 'holdings' && isin !== undefined) {
                    state.sharedAnalytics[i][portfolioId].holdingAnalytics = { ...state.sharedAnalytics[i][portfolioId].holdingAnalytics, ...{ [isin]: data } }
                }
                alrExists = true
            }
        }

        if (!alrExists && isin === undefined) {
            state.sharedAnalytics.push({
                [portfolioId]: data,
            });
        } else if (!alrExists && analyticsType === 'holdings' && isin !== undefined) {
            state.sharedAnalytics.push({ [portfolioId]: { holdingAnalytics: { [isin]: data } } })
            // state.sharedAnalytics.holdingAnalytics.push({
            //     [portfolioId]: { [isin]: data },
            // })
        }
    },
};