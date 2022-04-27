export default {
    setUser(state, payload) {
        state.userId = payload.userId;
        state.token = payload.token;
    },
    setPremium(state, payload) {
        state.hasPremium = payload;
    },
};