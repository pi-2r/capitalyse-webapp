import '../../../firebase'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

export default {
    resetPasswordEmail(email) {
        const auth = getAuth();
        sendPasswordResetEmail(auth, email).then(() => {
            console.log('Password reset email sent');
        }).catch(error => {
            console.log(error);
        });
    },
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
    async fetchProfileData(context) {
        const userId = localStorage.getItem("userId");

        const docRef = doc(db, `users/${userId}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log(docSnap.data());
        } else {
            console.log("No such document!");
        }

        context.commit("setProfileData", docSnap.data());
    }
};