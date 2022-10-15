import '../../../firebase'
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

const API_BASE = 'https://capitalyse.herokuapp.com'
// const API_BASE = 'http://localhost:3000'

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
        const auth = getAuth();
        const API_URL = '/api/auth/register'

        context.commit('setAuthError', null);

        fetch(API_BASE + API_URL, {
            method: "POST",
            body: JSON.stringify({
                email: payload.email,
                password: payload.password,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => response.json())
            .then((data) => {
                signInWithCustomToken(auth, data.token)
                    .then((userCredential) => {
                        // Signed in
                        const user = userCredential.user;
                         context.commit("setUser", {
                            token: user.accessToken,
                            userId: user.uid,
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                context.commit("setAuthError", error);
            });
    },
    googleAuth(context, payload) {
        // This gives you a Google Access Token. You can use it to access Google APIs.
        const credential = GoogleAuthProvider.credentialFromResult(payload.result);
        // The signed-in user info.
        const token = credential.idToken;
        const user = payload.result.user.uid;

        context.commit('setAuthError', null);

        context.commit('setUser', {
            token: token,
            userId: user,
        });

        localStorage.setItem("token", token);
        localStorage.setItem("userId", user);
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