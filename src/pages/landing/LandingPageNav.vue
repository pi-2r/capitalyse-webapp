<template lang="">
    <nav>
        <section class="navWrapper">
            <section class="navWrapper__logo">
                <Logo color="white"/>
            </section>
            <section class="navWrapper__links">
                <a href="#">
                    <router-link to="/">Home</router-link>
                </a>
                <a href="#">
                    <router-link to="/features">Features</router-link>
                </a>
                <a href="#">
                    <router-link to="/pricing">Pricing</router-link>
                </a>
                <a href="#">
                    <router-link to="/faq">FAQ</router-link>
                </a>
            </section>
            <section class="navWrapper__buttons">
                <Button class="secondary navLogin" link to="/login">{{loginText}}</Button>
                <Button v-if="!isAuthenticated" class="navSignup" :class="[{ isAuthenticated : isAuthenticatedBtnStyling }]" link to="/signup">Sign up</Button>
            </section>

            <section class="hamburgerIcon">
                <Icon icon="charm:menu-hamburger" color="var(--clr-white)" height="30" />
            </section>
        </section>
    </nav>
</template>

<script>
import Logo from '../../components/ui/Logo.vue';
import { Icon } from '@iconify/vue';

export default {
    components: {
        Logo,
        Icon
    },
    computed: {
        isAuthenticated() {
            return this.$store.getters['isAuthenticated'];
        },
        loginText() {
            return this.isAuthenticated ? 'My Portfolios' : 'Log in';
        }
    }
}
</script>

<style scoped>
.isAuthenticatedBtnStyling {
    background-color:red;
}

.navWrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 80vw;
    height: 4rem;
    background-color: transparent;
}

.navWrapper__buttons {
    display: flex;
    gap: 0.5rem;

}

.navLogin {
    background-color: rgba(255, 255, 255, 0.053);
    color: var(--clr-very-light-blue);
    border: none;
    font-size: 1rem;
    padding: var(--btn-small-padding)
}

.navSignup {
    background-color: var(--clr-white);
    color: var(--clr-blue);
    padding: var(--btn-small-padding);
    border: none;
    font-size: 1rem;
}

.navWrapper__links{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 20rem;
}
.navWrapper__links a {
    color: var(--clr-very-light-blue);
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
}
.navWrapper__links a:hover {
    text-decoration: underline;
}

.hamburgerIcon {
    display: none;
}

/* router active styling */
.router-link-active {
    text-decoration: underline;
}

@media screen and (max-width: 950px) {
    .navWrapper__links, .navWrapper__buttons {
        display: none;
    }

    .navWrapper {
        width: 90vw;
    }

    .hamburgerIcon {
        display: block;
    }
}
</style>