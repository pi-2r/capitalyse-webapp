<template>
    <header>
        <nav class="nav-wrapper">
            <div class="nav-container">
                <section class="leftSide">
                    <ul>
                        <h2>
                            <router-link class="routerLinkH2" to="/">Analytics</router-link>
                        </h2>
                        <!-- <li><a href="index.html">Home</a></li>
                        <li><a href="about.html">About</a></li>
                        <li><a href="contact.html">Contact</a></li> -->
                        <li>
                            <router-link class="routerLink" to="/portfolios">
                            <Icon icon="bi:bar-chart-fill" height="13" />
                            My Portfolios</router-link>
                        </li> 
                    </ul>
                </section>
                
                <section class="rightSide">
                    <section v-if="!hasPremium">
                        <Button class="premiumBtn">
                            <Icon icon="fluent:premium-16-filled" color="var(--clr-white)" height="15" />
                            Premium
                        </Button>
                    </section>

                    <section>
                        <router-link to="/settings">
                            <Icon class="settingsIcon" icon="ci:settings" color="var(--clr-grey)" height="30" />
                        </router-link>
                    </section>

                    <LogoutButton />
                </section>
            </div>
            <div class="nav-container-mobile">

                <h2>Analytics</h2>
                <Icon @click="toggleMobileNav" class="hamburgerMenuIcon" icon="eva:menu-outline" color="var(--clr-black)" height="40" />
                <div class="nav-menu-mobile" :class="[{open : isMobileNavOpen}]">
                    <Icon @click="toggleMobileNav" icon="carbon:close" class="closeMobileNav" color="var(--clr-black)" height="50" />
                    <section class="nav-mobile-content">
                        <ul>
                            <h2>Analytics</h2>
                            <li @click="closeNav">
                                <router-link class="routerLink" to="/portfolios">
                                <Icon icon="bi:bar-chart-fill" height="20" />
                                    My Portfolios
                                </router-link>
                            </li> 
                            <li @click="closeNav">
                                <router-link class="routerLink" to="/premium">
                                    <Icon icon="fluent:premium-16-filled" height="20" />
                                    Premium
                                </router-link>
                            </li> 
                            <li @click="closeNav">
                                  <router-link class="routerLink" to="/settings">
                                <Icon icon="clarity:settings-solid" height="20" />
                                Settings
                                </router-link>
                            </li> 
                            <li @click="closeNav" class="logoutLi">
                                <LogoutButton/> 

                            </li> 
                        </ul>
                    </section>
                </div>
            </div>
        </nav>
    </header>
</template>

<script>
import { Icon } from '@iconify/vue';
import LogoutButton from '../../components/ui/LogoutButton.vue';


export default {
    components: {
        Icon,
        LogoutButton,
    },
    data() {
        return {
            isMobileNavOpen: false,
        }
    }, 
    computed: {
        hasPremium() {
            return this.$store.getters['auth/hasPremium'];
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
.logoutLi {
    color: var(--clr-red);
}

.open {
    display: block !important;
    opacity: 1 !important;
}

.closeMobileNav {
    position: absolute;
    right: 1rem;
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
    background-color: var(--clr-white);
    z-index: 100;
    transition: all 0.3s ease-in-out;
    overflow: hidden;
}

.nav-mobile-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 4rem;
}

.nav-mobile-content h2 {
    font-size: 2.5rem;
    text-align: center;
}

.nav-mobile-content ul {
    text-align: center;
    font-size: 1.4rem;
    font-weight: 300;
}

.nav-mobile-content ul li {
    display: flex;
    justify-content: center;
    align-items: center;
    grid-gap: 0.5rem;
    margin-top: 2rem;
}

.hamburgerMenuIcon:hover {
    cursor: pointer;

}


.premiumBtn {
    background-color: var(--clr-blue);
    color: var(--clr-white);
    padding: var(--btn-small-padding);
}

.routerLink {
    text-decoration: none;
    color: var(--clr-grey);
}

.routerLinkH2 {
    text-decoration: none;
    color: var(--clr-black);
}

.routerLinkH2:hover {
    text-decoration: none;
    color: var(--clr-black);
}

.router-link-exact-active {
    color: var(--clr-blue);
}


h2 {
    color: var(--clr-black);
    font-weight: 600;
    font-size: 1.5rem;
}

li {
    list-style: none;
}

.leftSide ul {
    display: flex;
    justify-content: center;
    align-items: baseline;
    
}


.leftSide li {
    margin-left: 2.5rem;
    list-style-type: none;
    color: var(--clr-grey);
    display: flex;
    justify-content: center;
    font-size: 1.1rem;
    align-items: center;
    grid-gap: 0.5rem;
}

h2 a{
    text-decoration: none;
    color: var(--clr-grey);
}

a:hover {
    color: var(--clr-blue);
    cursor: pointer;
}

.settingsIcon:hover {
    cursor: pointer;
    color: var(--clr-blue);
}

.rightSide {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.rightSide section {
    display: flex;
    align-items: center;
    margin-left: 1rem;
}

.nav-container {
    margin: 0 auto;
    width: 95%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-wrapper {
    background-color: var(--clr-very-light-blue);
    height: var(--header-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: var(--box-shadow-big);
    border-bottom: var(--light-border);
}

/* media queries */

@media screen and (min-width: 400px) {
    .nav-container, .nav-container-mobile {
        max-width: 92%;
    }   
}

@media screen and (min-width: 650px) {
 

    .nav-container, .nav-container-mobile {
        max-width: 90%;
    }
}

@media screen and (min-width: 1050px) {
   

    .nav-container, .nav-container-mobile {
        max-width: 1000px;
    }
}

/* Media Queries */

@media screen and (max-width: 850px) {


   .rightSide section {
       margin-left: 0.5rem;
   }

    .leftSide ul {
        flex-direction: column;
    }

    .nav-wrapper {
        justify-content: center;
    }

    .nav-container-mobile {
        display: flex;
    }

    .nav-container {
        display: none;
    }
   
}


    

  
</style>