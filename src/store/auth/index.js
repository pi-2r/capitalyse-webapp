import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";

export default {
    state() {
        return {
            userId: null,
            token: null,
            hasPremium: false,
            error: null,
        };
    },
    mutations,
    getters,
    actions,
};
