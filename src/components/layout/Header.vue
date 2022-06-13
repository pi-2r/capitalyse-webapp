<template>
  <header>
    <nav class="nav-wrapper">
      <div class="nav-container">
        <section class="leftSide">
          <ul>
            <a href="https://www.capitalyse.net/" class="routerLinkLogo">
              <Logo />
            </a>

            <!-- <li><a href="index.html">Home</a></li>
                        <li><a href="about.html">About</a></li>
                        <li><a href="contact.html">Contact</a></li> -->
            <!-- <li>
                            <router-link class="routerLink" to="/portfolios">
                                My Portfolios
                            </router-link>
                        </li>  -->
          </ul>
        </section>

        <section class="rightSide">
          <!-- <section v-if="!hasPremium">
                        <Button class="premiumBtn">
                            <Icon icon="fluent:premium-16-filled" color="var(--clr-white)" height="15" />
                            Premium
                        </Button>
                    </section> -->
          <router-link to="/signup">
            <Button v-if="!isAuth" class="signupButton"> Sign up </Button>
          </router-link>
          <section class="u-displayflex">
            <router-link to="/settings" class="u-displayflex settingsSection">
              <Icon
                class="settingsIcon"
                tabindex="0"
                icon="ci:settings"
                height="23"
              />
            </router-link>
          </section>
        </section>
      </div>
      <div class="nav-container-mobile">
        <a href="https://www.capitalyse.net/" class="routerLinkLogo">
          <Logo />
        </a>

        <section class="rightSide">
          <router-link to="/signup">
            <Button v-if="!isAuth" class="signupButton"> Sign up </Button>
          </router-link>

          <Icon
            @click="toggleMobileNav"
            class="hamburgerMenuIcon"
            icon="eva:menu-outline"
            color="var(--clr-grey)"
            height="30"
          />
        </section>
        <transition name="slide-fade" mode="out-in">
          <div class="nav-menu-mobile" :class="{ open: isMobileNavOpen }">
            <Icon
              @click="toggleMobileNav"
              icon="carbon:close"
              class="closeMobileNav"
              color="var(--clr-black)"
              height="35"
            />
            <section class="nav-mobile-content">
              <ul>
                <router-link class="routerLinkLogo" to="/portfolios">
                  <Logo />
                </router-link>
                <li>
                  <router-link class="routerLink" to="/portfolios"
                    >My Portfolios</router-link
                  >
                </li>
                <!-- <li >
                                    <router-link class="routerLink" to="/premium">
                                        Premium
                                    </router-link>
                                </li>  -->
                <li>
                  <router-link class="routerLink" to="/settings"
                    >Settings</router-link
                  >
                </li>
              </ul>
            </section>
          </div>
        </transition>
      </div>
    </nav>
  </header>
</template>

<script>
import { Icon } from "@iconify/vue";
import Logo from "@/components/ui/Logo.vue";

export default {
  components: {
    Icon,
    Logo,
  },
  data() {
    return {
      isMobileNavOpen: false,
    };
  },
  computed: {
    hasPremium() {
      return this.$store.getters["auth/hasPremium"];
    },
    isAuth() {
      return this.$store.getters["isAuthenticated"];
    },
  },
  methods: {
    toggleMobileNav() {
      if (this.isMobileNavOpen) {
        this.isMobileNavOpen = false;
      } else {
        this.isMobileNavOpen = true;
      }
    },
    closeNav() {
      this.isMobileNavOpen = false;
    },
  },
};
</script>

<style scoped>
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
  top: 2rem;
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

.signupButton {
  background-color: var(--clr-blue);
  background-image: linear-gradient(to right, #008cff, #006eff 100%);
  color: var(--clr-white);
  padding: 0.5rem 0.9rem;
}

.routerLink {
  font-size: 1rem;
  text-decoration: none;
  font-weight: 500;
  color: var(--clr-grey);
}

.routerLink:hover {
  color: var(--clr-dark-grey);
}

.routerLinkLogo {
  text-decoration: none;
}

.logoIcon {
  color: var(--clr-dark-grey);
}

li {
  list-style: none;
}

.leftSide ul {
  display: flex;
  justify-content: center;
  align-items: center;
}

.leftSide li {
  margin-left: 4rem;
  list-style-type: none;
  color: var(--clr-grey);
  display: flex;
  justify-content: center;
  align-items: center;
  grid-gap: 0.5rem;
}

a:hover {
  color: var(--clr-blue);
  cursor: pointer;
}

.settingsSection {
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-weight: 600;
  color: var(--clr-grey);
  gap: 0.3rem;
}

.settingsIcon {
  transition: 0.2s all;
  border: none;
  outline: none;
  color: var(--clr-grey);
}

.settingsSection:hover .settingsIcon,
.settingsSection:hover {
  cursor: pointer;
  color: var(--clr-dark-grey);
}

.rightSide {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.75rem;
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
  background-color: var(--clr-white);
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--box-shadow-medium);
  border-bottom: 1px solid var(--clr-light-grey);
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
  .nav-container,
  .nav-container-mobile {
    max-width: 92%;
  }
}

@media screen and (min-width: 650px) {
  .nav-container,
  .nav-container-mobile {
    max-width: 90%;
  }
}

@media screen and (min-width: 1050px) {
  .nav-container,
  .nav-container-mobile {
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
  .signupButton {
    font-size: 1rem;
  }

  .nav-container {
    display: none;
  }
}
</style>