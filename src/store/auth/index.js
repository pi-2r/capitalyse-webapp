import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";

export default {
    state() {
        return {
            userId: null,
            token: null,
            photoURL: null,
            emailVerified: null,
            displayName: null,
            email: null,
            error: null,
            profileData: {
                theme: null,
                language: null,
                plan: null,
            },
        };
    },
    mutations,
    getters,
    actions,
};
