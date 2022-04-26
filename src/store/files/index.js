import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export default {
    namespaced: true,
    state() {
        return {
            portfolios: [],
            dashboardPortfolio: null,
            transactionsFile: null,
            accountFile: null,
        };
    },
    mutations,
    getters,
    actions
}