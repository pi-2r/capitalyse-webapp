<template>
    <section class="wrapper">
        <GoogleIcon class="googleLogin" @click="googleSignIn"/>
    </section>
</template>

<script>
import GoogleIcon from '../../../node_modules/vue-material-design-icons/Google.vue'

export default {
    components: {
        GoogleIcon
    },
    data() {
        return {
            token: null,
            user: null,
        }
    },
    methods: {
        googleSignIn() {
            alert('Unfortunately, Google Signin is not supported yet.');
        },
        log() {
            console.log(this.token, this.user);
        }
    },
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