export default {
    setUserId(state, payload) {
        state.userId = payload.userId;
        state.token = payload.token;
    },
};