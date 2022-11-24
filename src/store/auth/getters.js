export default {
    userId(state) {
        return state.userId;
    },
    getPhotoURL(state) {
        return state.photoURL;
    },
    getDisplayName(state) {
        return state.photoURL;
    },
    token(state) {
        return state.token;
    },
    isAuthenticated(state) {
        return !!state.token;
    },
    getAuthError(state) {
        return state.error;
    },
    getProfileData(state) {
        return state.userData;
    },
};