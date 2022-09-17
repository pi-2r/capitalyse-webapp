<template>
    <button class="googleLogin wrapper" @click="googleSignIn">
        <section v-if="!isLoading" class="contents">
            <p class="signupText">Or continue with</p>
            <Icon  icon="bi:google" class="googleIcon"/>
        </section>
        <Spinner class="spinner" v-else/>
    </button>
</template>

<script>
import { Icon } from '@iconify/vue';

import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";
const provider = new GoogleAuthProvider();
const auth = getAuth();

export default {
    components: {
        Icon
    },
    data() {
        return {
            token: null,
            user: null,
            isLoading: false,
        }
    },
    methods: {
        // wanneer er op de google icon wordt geklikt
        googleSignIn() {
            this.isLoading = true;
            signInWithRedirect(auth, provider);
        },
    },
    created() {
        this.isLoading = true;
        getRedirectResult(auth)
            .then((result) => {
                if(result !== null) {
                    // This gives you a Google Access Token. You can use it to access Google APIs.
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    // The signed-in user info.
                    const token = credential.accessToken;
                    const user = result.user;

                    this.$store.dispatch("googleAuth", {
                        accessToken: token,
                        userId: user.uid,
                    });
                    this.isLoading = false;
                } else {
                    this.isLoading = false;
                }
            }).catch((error) => {
                // Error
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);

                console.log(errorCode, errorMessage, email, credential);
                this.isLoading = false;

                alert("Something went wrong, please try authentication through e-mail and password.")
            });
    }
}
</script>

<style scoped>
.contents {
display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}
.spinner {
    transform: scale(0.75);
}
.wrapper {
    cursor: pointer;
    background-color: var(--clr-light-grey);
    padding-top: 0.85rem;
    padding-bottom: 0.85rem;
    border-radius: var(--btn-radius);
    margin: 0 auto;
    margin-top: 2rem;
}
.signupText {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--clr-grey);
    transition: 0.2s all;
}
.googleIcon {
    color: var(--clr-grey);
    transition: 0.2s all;
}
.wrapper:hover .signupText, .wrapper:hover .googleIcon {
    color: var(--clr-dark-grey);
}

.googleLogin {
    display: block;
    width: 100%;
    border: transparent;
}
</style>