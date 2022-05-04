import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword  } from 'firebase/auth';


export default {
    login(context, payload) {
        context.commit('setAuthError', null);

        const auth = getAuth();
        signInWithEmailAndPassword(auth, payload.email, payload.password)
            .then((userCredential) => {
                localStorage.setItem("token", userCredential.user.accessToken);
                localStorage.setItem("userId", userCredential.user.uid);
                context.commit("setUser", {
                    token: userCredential.user.accessToken,
                    userId: userCredential.user.uid,
                });
            })
            .catch((error) => {
                context.commit("setAuthError", error);
            });
    },
    async signup(context, payload) {
        context.commit('setAuthError', null);

        const auth = getAuth();
        createUserWithEmailAndPassword(auth, payload.email, payload.password)
            .then((userCredential) => {
                localStorage.setItem("token", userCredential.user.accessToken);
                localStorage.setItem("userId", userCredential.user.uid);
                context.commit("setUser", {
                    token: userCredential.user.accessToken,
                    userId: userCredential.user.uid,
                });
            })
            .catch((error) => {
                context.commit("setAuthError", error);
            });
    },
    logout(context) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        context.commit('files/resetDataState');
        context.commit("resetAuthState");
    },
    tryLogin(context) {

        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (token && userId) {
            context.commit("setUser", {
                token,
                userId,
            });
        }
    },
};