export default {
    state() {
        return {
            userId: null,
            token: null,
        };
    },
    mutations: {
        setUserId(state, payload) {
            state.userId = payload.userId;
            state.token = payload.token;
        },
    },
    getters: {
        userId(state) {
            return state.userId;
        },
        token(state) {
            return state.token;
        },
        isAuthenticated(state) {
            return !!state.token;
        },
    },
    actions: {
        async login(context, payload) {
            console.log(context, payload);
        },
        async signup(context, payload) {
            console.log(context, payload);
        },
        logout(context) {
            console.log(context);
        },
        tryLogin(context) {
            console.log(context);
        }
    },
}