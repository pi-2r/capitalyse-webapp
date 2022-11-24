export default {
    setUser(state, payload) {
        state.userId = payload.userId;
        state.token = payload.token;
        state.photoURL = payload.photoURL;
        state.displayName = payload.displayName;
        state.emailVerified = payload.emailVerified;
        state.email = payload.email;
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
        state.photoURL = null;
        state.displayName = null;
        state.emailVerified = null;
        state.email = null;
    },
    setProfileData(state, payload) {
        state.profileData = payload;
    },
};