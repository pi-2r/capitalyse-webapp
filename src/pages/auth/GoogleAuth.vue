<template>
    <section class="wrapper">
        <GoogleIcon class="googleLogin" @click="googleSignIn"/>
    </section>
</template>

<script>
import GoogleIcon from '../../../node_modules/vue-material-design-icons/Google.vue'

// import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult} from 'firebase/auth';


import "firebase/compat/auth"
import "firebase/compat/firestore"

export default {
    components: {
        GoogleIcon
    },
    methods: {
        googleSignIn() {

            window.alert("Google Sign in is not available yet. Please use the email and password sign in instead.");
            // const auth = getAuth();
            // const provider = new GoogleAuthProvider();
            // signInWithRedirect(auth, provider)

            // getRedirectResult(auth)
            //     .then((result) => {
            //         // This gives you a Google Access Token. You can use it to access Google APIs.
            //         const credential = GoogleAuthProvider.credentialFromResult(result);
            //         const token = credential.accessToken;

            //         // The signed-in user info.
            //         const user = result.user;

            //         console.log(credential);
            //         console.log(token);
            //         console.log(user);

                    
            //     }).catch((error) => {
            //         // Handle Errors here.
            //         const errorCode = error.code;
            //         const errorMessage = error.message;
            //         // The email of the user's account used.
            //         const email = error.email;
            //         // The AuthCredential type that was used.
            //         const credential = GoogleAuthProvider.credentialFromError(error);

            //         console.log(errorCode, errorMessage, email, credential);
            //         // ...
            //     });
            
        },

    }
}
</script>

<style scoped>





p {
    color: grey;
    text-align: left;
    font-weight: 300;
    font-size: 0.75rem;
}

.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid rgb(78, 78, 78);
    padding-top: 1rem;
    margin-top: 0.5rem;
    gap: 1rem
}

.googleLogin {
    display: inline-block;
    color: var(--clr-grey);
    transition: 0.2s all;
    transform: scale(1.1);
}

.googleLogin:hover {
    color: rgb(148, 148, 148);
    cursor: pointer;
}
</style>