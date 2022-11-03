import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export default {
    namespaced: true,
    state() {
        return {
            portfolios: [],
            analytics: [],
            sharedAnalytics: [],
            uploadingState: 'none',
        };
    },
    mutations,
    getters,
    actions
}