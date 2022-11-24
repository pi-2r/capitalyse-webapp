import '../../../firebase'
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

// const API_BASE = 'https://capitalyse.herokuapp.com'
const API_BASE = process.env.VUE_APP_API_BASE || 'https://capitalyse.herokuapp.com'

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
                localStorage.setItem("email", userCredential.user.email);
                localStorage.setItem("displayName", userCredential.user.displayName);
                localStorage.setItem("photoURL", userCredential.user.photoURL);
                localStorage.setItem("userId", userCredential.user.uid);
                localStorage.setItem("emailVerified", userCredential.user.emailVerified);

                context.commit("setUser", {
                    token: userCredential.user.accessToken,
                    userId: userCredential.user.uid,
                    email: userCredential.user.email,
                    displayName: userCredential.user.displayName,
                    photoURL: userCredential.user.photoURL,
                    emailVerified: userCredential.user.emailVerified,
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
                        localStorage.setItem("token", userCredential.user.accessToken);
                        localStorage.setItem("email", userCredential.user.email);
                        localStorage.setItem("displayName", userCredential.user.displayName);
                        localStorage.setItem("photoURL", userCredential.user.photoURL);
                        localStorage.setItem("userId", userCredential.user.uid);
                        localStorage.setItem("emailVerified", userCredential.user.emailVerified);
                        
                        // Signed in
                        context.commit("setUser", {
                            token: userCredential.user.accessToken,
                            userId: userCredential.user.uid,
                            email: userCredential.user.email,
                            displayName: userCredential.user.displayName,
                            photoURL: userCredential.user.photoURL,
                            emailVerified: userCredential.user.emailVerified,
                        });
                    })
                    .catch((error) => {
                        context.commit("setAuthError", error);
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

        context.commit("setUser", {
            token: token,
            userId: user,
            email: payload.result.user.email,
            displayName: payload.result.user.displayName,
            photoURL: payload.result.user.photoURL,
            emailVerified: payload.result.user.emailVerified,
        });

        localStorage.setItem("token", payload.result.user.accessToken);
        localStorage.setItem("email", payload.result.user.email);
        localStorage.setItem("displayName", payload.result.user.displayName);
        localStorage.setItem("photoURL", payload.result.user.photoURL);
        localStorage.setItem("userId", payload.result.user.uid);
        localStorage.setItem("emailVerified", payload.result.user.emailVerified);
    },
    logout(context) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("email");
        localStorage.removeItem("displayName");
        localStorage.removeItem("photoURL");
        localStorage.removeItem("emailVerified");

        context.commit('files/resetDataState');
        context.commit("resetAuthState");
    },
    tryLogin(context) {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const email = localStorage.getItem("email");
        const dispayName = localStorage.getItem("displayName");
        const photoURL = localStorage.getItem("photoURL");
        const emailVerified = localStorage.getItem("emailVerified");

        if (token && userId) {
            context.commit("setUser", {
                token: token,
                userId: userId,
                email: email,
                displayName: dispayName,
                photoURL: photoURL,
                emailVerified: emailVerified,
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