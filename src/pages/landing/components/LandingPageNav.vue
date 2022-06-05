<template lang="">
    <nav>
        <section class="navWrapper">
            <section class="navWrapper__logo">
                <Logo color="white"/>
            </section>
            <section class="navWrapper__links">
                <a href="#">
                    <router-link class="u-router-destyle" to="/">Home</router-link>
                </a>
                <a href="#">
                    <router-link class="u-router-destyle" to="/features">Features</router-link>
                </a>
                <a href="#">
                    <router-link class="u-router-destyle" to="/pricing">Pricing</router-link>
                </a>
                <a href="#">
                    <router-link class="u-router-destyle" to="/faq">FAQ</router-link>
                </a>
            </section>
            <section class="navWrapper__buttons">
                <Button class="secondary navLogin u-router-destyle" link to="/login">{{loginText}}</Button>
                <Button v-if="!isAuthenticated" class="navSignup" :class="{'isAuthenticated' : isAuthenticatedBtnStyling}" link to="/signup">Sign up</Button>
            </section>

            <section class="hamburgerIcon">
                <Icon icon="charm:menu-hamburger" @click="toggleMobileNav" class="hamburgerMenuIcon" color="var(--clr-white)" height="30" />
            </section>
        </section>

         <div class="nav-container-mobile">
                <transition name="slide-fade" mode="out-in">
                    <div class="nav-menu-mobile" :class="{'open' : isMobileNavOpen}">
                        <Icon @click="toggleMobileNav" icon="carbon:close" class="closeMobileNav" color="var(--clr-white)" height="50" />
                        <section class="nav-mobile-content">
                            <ul>
                                <router-link class="routerLinkLogo" to="/">
                                    <Logo color="var(--clr-white)"/>
                                </router-link>
                                <li >
                                    <router-link class="routerLink" to="/">Home</router-link>
                                </li> 
                                <!-- <li >
                                    <router-link class="routerLink" to="/premium">
                                        Premium
                                    </router-link>
                                </li>  -->
                                <li>
                                    <router-link class="routerLink" to="/">Features</router-link>
                                </li> 
                                <li>
                                    <router-link class="routerLink" to="/">Pricing</router-link>
                                </li> 
                                <li>
                                    <router-link class="routerLink" to="/">FAQ</router-link>
                                </li> 
                                <section class="mobileNavButtons">
                                    <Button class="secondary navLogin u-router-destyle" link to="/login">{{loginText}}</Button>
                                    <Button v-if="!isAuthenticated" class="navSignup" :class="{'isAuthenticated' : isAuthenticatedBtnStyling}" link to="/signup">Sign up</Button>
                                </section>
                            </ul>
                        </section>
                    </div>
                </transition>
            </div>
    </nav>
</template>

<script>
import { Icon } from '@iconify/vue';

import Logo from '@/components/ui/Logo.vue';

export default {
    components: {
        Logo,
        Icon
    },
    data() {
        return {
            isMobileNavOpen: false,
        }
    },
    computed: {
        isAuthenticated() {
            return this.$store.getters['isAuthenticated'];
        },
        loginText() {
            return this.isAuthenticated ? 'My Portfolios' : 'Log in';
        }
    },
     methods: {
        toggleMobileNav() {
            if(this.isMobileNavOpen) {
                this.isMobileNavOpen = false;
            } else {
                this.isMobileNavOpen = true;
            }
        },
        closeNav() {
            this.isMobileNavOpen = false;
        },
    },
}
</script>

<style scoped>
.u-router-destyle:hover {
    color: var(--clr-white);
}

.mobileNavButtons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    margin-top: 5rem;
    gap: 2rem;
}

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


.logoBanner {
    height: 25px;
}

.open {
    display: block !important;
    opacity: 1 !important;
}

.closeMobileNav {
    position: absolute;
    right: 2rem;
    top: 1rem;
    transition: all 0.3s;
}

.closeMobileNav:hover {
    cursor: pointer;
    transform: rotate(90deg);
}

.nav-container-mobile {
    display: none;
    justify-content: space-between;
    align-items: center;
    width: 92%;
}

.nav-menu-mobile {
    display: none;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgb(30, 30, 30);
    z-index: 100;
    transition: all 0.3s ease-in-out;
    overflow: hidden;
}

.nav-mobile-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 25%;
}

.nav-mobile-content ul {
    text-align: center;
}

.nav-mobile-content .routerLink {
    font-size: 1.5rem;
}

.nav-mobile-content ul .routerLinkLogo {
    position: absolute;
    top: 2rem;
    left: 2rem;
}

.nav-mobile-content ul li {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
}

.hamburgerMenuIcon:hover {
    cursor: pointer;

}

.routerLink {
    font-size: 1rem;
    text-decoration: none;
    font-weight: 500;
    color: var(--clr-white);
}

.routerLink:hover {
    color: var(--clr-white);
}

.routerLinkLogo {
    text-decoration: none;
} 

.logoIcon {
    color: var(--clr-white);
}

li {
    list-style: none;
}

a:hover {
    color: var(--clr-blue);
    cursor: pointer;
}


.u-displayflex {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* anim */

.slide-fade-enter-active {
  transition: all 0.15s ease;
}

.slide-fade-leave-active {
  transition: all 0.1s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}

/* .router-link-active {
    color: var(--clr-blue);
} */

/* media queries */

@media screen and (min-width: 400px) {
    .nav-container-mobile {
        max-width: 92%;
    }   
}

@media screen and (min-width: 650px) {
    .nav-container-mobile {
        max-width: 90%;
    }
}

@media screen and (min-width: 1050px) {
    .nav-container-mobile {
        max-width: 1000px;
    }
}

/* Media Queries */

@media screen and (max-width: 850px) {
    .nav-container-mobile {
        display: flex;
    }

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