import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export default {
    namespaced: true,
    state() {
        return {
            portfolios: [],
            currentPortfolio: {
                accountFile: null,
                transactionsFile: null,
            },
            uploadingState: 'none',
        };
    },
    mutations,
    getters,
    actions
}