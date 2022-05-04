export default {
    setUser(state, payload) {
        state.userId = payload.userId;
        state.token = payload.token;
    },
    setPremium(state, payload) {
        state.hasPremium = payload;
    },
    setAuthError(state, payload) {
        state.error = payload;
    },
    resetAuthState(state) {
        state.userId = null;
        state.token = null;
        state.hasPremium = false;
        state.error = null;
    }
};