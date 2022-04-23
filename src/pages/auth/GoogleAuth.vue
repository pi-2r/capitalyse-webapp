<template>
<section class="wrapper">
   
    <GoogleIcon class="googleLogin" @click="googleSignIn"/>

  
</section>
</template>

<script>
import GoogleIcon from '../../../node_modules/vue-material-design-icons/Google.vue'

import { GoogleAuthProvider } from "firebase/auth";

import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"

export default {
    components: {
        GoogleIcon
    },
    methods: {
        googleSignIn() {
            window.alert("Google sign in not available yet")

            const provider = new GoogleAuthProvider();
            
            firebase
                .auth()
                .signInWithPopup(provider)
                .then((result) => {
                let token = result.credential.accessToken;
                let user = result.user;
                    console.log(token) // Token
                    console.log(user) // User that was authenticated
                })
                .catch((e) => {
                    console.log(e);
                 // This will give you all the information needed to further debug any errors
            });  
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