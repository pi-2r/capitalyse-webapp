<template>
  <section
    class="leftSide__myPortfolioPopupBackdrop"
    v-if="isMyPortfoliosPopupOpen"
    @click="toggleMyPortfoliosPopup"
  ></section>
  <header>
    <nav class="nav-wrapper">
      <section class="nav-container">
        <section class="leftSide">
          <ul>
            <router-link to="/portfolios" style="text-decoration: none">
              <Logo />
            </router-link>

            <li class="dropDownLi">
              <button
                class="dropDownLiText"
                :class="{ linkIsActive: isMyPortfoliosPopupOpen }"
                @click="toggleMyPortfoliosPopup"
              >
                Portfolios
                <Icon
                  class="routerLinkDropDownIcon"
                  :class="{ rotateDropDownIcon: isMyPortfoliosPopupOpen }"
                  icon="ep:arrow-down-bold"
                  height="12"
                />
              </button>
              <!-- Pop-up -->

              <transition mode="out-in" name="slide-fade">
                <section
                  v-if="isMyPortfoliosPopupOpen"
                  class="leftSide__myPortfoliosPopup"
                >
                  <section class="leftSide__myPortfoliosPopupWrapper">
                    <router-link
                      to="/portfolios"
                      style="text-decoration: none; color: inherit"
                    >
                      <section class="leftSide__myPortfoliosPopupButtonWrapper">
                        <button
                          class="leftSide__myPortfoliosPopupButton"
                          @click="toggleMyPortfoliosPopup()"
                        >
                          <Icon
                            icon="entypo:list"
                            class="headingIcon"
                            height="18"
                          />
                          Portfolios
                        </button>
                      </section>
                    </router-link>
                    <section class="leftSide__myPortfoliosPopupList">
                      <router-link
                        style="text-decoration: none"
                        @click="toggleMyPortfoliosPopup()"
                        :to="'/dashboard/' + portfolio.id"
                        class="leftSide__myPortfoliosPopupLink"
                        v-for="portfolio in headerPortfoliosFromStore"
                        :key="portfolio.id"
                      >
                        {{ portfolio.portfolioName }}
                        <Icon
                          class="leftSide__myPortfoliosPopupLinkIcon"
                          icon="charm:arrow-right"
                          color="var(--clr-blue)"
                          height="15"
                        />
                      </router-link>
                    </section>

                    <section
                      class="popupNoPortfolios"
                      v-if="headerPortfoliosFromStore.length === 0"
                    >
                      You currently have no portfolios, add one
                      <router-link
                        @click="toggleMyPortfoliosPopup"
                        to="/portfolios/new"
                        >here</router-link
                      >
                      to get started.
                    </section>
                  </section>
                </section>
              </transition>
            </li>
          </ul>
        </section>

        <section class="rightSide">
          <section v-if="isAuth">
            <a
              href="https://capitalyse.app/plans"
              target="_blank"
              class="premiumBtn"
            >
              <Icon
                icon="mdi:cards-heart"
                color="var(--clr-white)"
                height="15"
              />
              <span>Donate</span>
            </a>
          </section>
          <router-link to="/signup" class="u-remove-router-styling">
            <Button v-if="!isAuth" class="signupButton"> Sign up </Button>
          </router-link>
          <section class="u-displayflex">
            <router-link to="/settings" class="u-displayflex settingsSection">
              <!-- <Icon
                class="settingsIcon"
                tabindex="0"
                icon="gg:profile"
                height="23"
              /> -->

              <img
                v-if="userPhotoURL !== null && userPhotoURL !== 'null'"
                :src="userPhotoURL"
                class="userProfilePicture"
                alt="Account"
              />
              <section v-else class="defaultProfilePic">
                <Icon
                  class="defaultProfilePicIcon"
                  tabindex="0"
                  icon="mingcute:user-3-fill"
                  height="23"
                />
              </section>
            </router-link>
          </section>
        </section>
      </section>
      <section class="nav-container-mobile">
        <router-link
          to="/portfolios"
          style="text-decoration: none"
          class="routerLinkLogo"
        >
          <Logo />
        </router-link>

        <section class="rightSide">
          <router-link to="/signup">
            <Button v-if="!isAuth" class="signupButton"> Sign up </Button>
          </router-link>

          <Icon
            @click="toggleMobileNav"
            class="hamburgerMenuIcon"
            icon="ci:menu-duo"
            color="var(--clr-grey)"
            height="30"
          />

          <router-link to="/settings" class="u-displayflex settingsSection">
            <!-- <Icon
                class="settingsIcon"
                tabindex="0"
                icon="gg:profile"
                height="23"
              /> -->

            <img
              v-if="userPhotoURL !== null && userPhotoURL != 'null'"
              :src="userPhotoURL"
              class="userProfilePicture"
              alt="Account"
            />
            <section v-else class="defaultProfilePic">
              <Icon
                class="defaultProfilePicIcon"
                tabindex="0"
                icon="mingcute:user-3-fill"
                height="23"
              />
            </section>
          </router-link>
        </section>
        <transition name="slide-fade" mode="out-in">
          <section class="nav-menu-mobile" :class="{ open: isMobileNavOpen }">
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
                <li>
                  <a
                    target="_blank"
                    class="routerLink"
                    href="https://capitalyse.app/plans"
                  >
                    Donate
                    <Icon
                      icon="uil:external-link-alt"
                      color="var(--clr-blue)"
                      height="15"
                    />
                  </a>
                </li>
              </ul>
            </section>
          </section>
        </transition>
      </section>
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
      isMyPortfoliosPopupOpen: false,
    };
  },
  computed: {
    hasPremium() {
      return this.$store.getters["auth/hasPremium"];
    },
    isAuth() {
      return this.$store.getters["isAuthenticated"];
    },
    headerPortfoliosFromStore() {
      return this.$store.getters["files/getPortfolios"];
    },
    userPhotoURL() {
      return this.$store.getters["getPhotoURL"];
    },
  },
  watch: {
    $route() {
      // sluit de popup als de url veranderd
      this.isMyPortfoliosPopupOpen = false;
    },
    headerPortfoliosFromStore() {
      // sorteert de portfolio op datum zodra deze aanwezig zijn
      this.sortHeaderPortfoliosByDate();
    },
  },
  methods: {
    sortHeaderPortfoliosByDate() {
      // sorteer portfolios op datum met de seconds waarde
      this.headerPortfoliosFromStore.sort((a, b) => {
        return new Date(b.addedAt._seconds) - new Date(a.addedAt._seconds);
      });
    },
    toggleMyPortfoliosPopup() {
      // toggle de portfolios link popup
      if (this.isMyPortfoliosPopupOpen) {
        this.isMyPortfoliosPopupOpen = false;
      } else {
        this.isMyPortfoliosPopupOpen = true;
      }
    },
    toggleMobileNav() {
      // toggle de mobiele navigatie
      if (this.isMobileNavOpen) {
        this.isMobileNavOpen = false;
      } else {
        this.isMobileNavOpen = true;
      }
    },
    closeNav() {
      // sluit de mobiele navigatie
      this.isMobileNavOpen = false;
    },
  },
};
</script>

<style scoped>
.premiumBtn {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  background-color: var(--clr-blue);
  color: var(--clr-white);
  text-decoration: none;
  border: none;
  border-radius: var(--btn-radius);
  padding: 0.4rem 0.9rem;
  font-size: 0.9rem;
  font-weight: 500;
  transition: 0.2s all;
  cursor: pointer;
  box-shadow: var(--btn-shadow);
}
.premiumBtn:hover {
  color: var(--clr-white);
  box-shadow: 1px 1px 8px rgba(0, 110, 255, 0.275);
}
.defaultProfilePicIcon {
  color: var(--clr-white);
  height: 16px;
}
.defaultProfilePic {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  width: 2rem;
  background: rgb(2, 0, 36);
  background-image: linear-gradient(
    to right,
    rgb(132, 132, 132),
    rgb(91, 91, 91) 100%
  );
  border-radius: 100%;
  transition: 0.2s all;
}

.userProfilePicture {
  height: 2.2rem;
  border-radius: 100%;
  border: 2px solid transparent;
  transition: 0.2s all;
}
.userProfilePicture:hover {
  box-shadow: var(--btn-shadow);
  border: 2px solid var(--clr-blue);
}

.popupNoPortfolios {
  width: 15rem;
  font-size: 0.8rem;
  padding: 0.5rem;
  text-align: center;
  display: block;
}
.popupNoPortfolios a {
  color: var(--clr-blue);
}

.leftSide__myPortfolioPopupBackdrop {
  position: absolute;
  width: 100%;
  height: 100%;
}

.leftSide__myPortfoliosPopupButtonWrapper {
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid var(--clr-light-grey);
}

.leftSide__myPortfoliosPopupButton {
  width: 100%;
  text-align: center;
  text-decoration: none;
  padding: var(--btn-small-padding);
  border-radius: var(--btn-radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  transition: 0.15s all;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--clr-medium-light-grey);
  box-shadow: var(--btn-shadow);
  color: var(--clr-dark-grey);
  gap: 0.5rem;
  background-color: var(--clr-very-light-blue);
}
.leftSide__myPortfoliosPopupButton:hover {
  border: 1px solid var(--clr-medium-light-grey-2);
}

.dropDownLi {
  position: relative;
}

.linkIsActive {
  color: var(--clr-blue) !important;
}

.dropDownLiText {
  background-color: transparent;
  border: none;
  display: flex;
  font-size: 0.9rem;
  align-items: center;
  gap: 0.4rem;
  color: var(--clr-grey);
  cursor: pointer;
}
.dropDownLiText:hover {
  color: var(--clr-blue);
}

.rotateDropDownIcon {
  transform: rotateX(180deg);
}

.leftSide__myPortfoliosPopup {
  position: absolute;
  top: 2rem;
  left: 0;
}
.leftSide__myPortfoliosPopup {
  background-color: var(--clr-white);
  border: 1px solid var(--clr-medium-light-grey);
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow-small);
  min-width: 12rem;
  z-index: 99999;
  padding: 0.5rem;
}

.leftSide__myPortfoliosPopupList {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.leftSide__myPortfoliosPopupLink {
  padding: 0.4rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  font-size: 0.85rem;
  border-radius: 0.4rem;
  cursor: pointer;
  transition: 0.15s all;
  border: 1px solid transparent;
  color: var(--clr-grey);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.leftSide__myPortfoliosPopupLinkIcon {
  transition: 0.3s all;
  transform: translateX(-5px);
  opacity: 0;
}

.leftSide__myPortfoliosPopupLink:hover {
  color: var(--clr-blue);
  border: 1px solid rgba(9, 124, 232, 0.5);

  background-color: rgba(9, 124, 232, 0.05);
}
.leftSide__myPortfoliosPopupLink:hover .leftSide__myPortfoliosPopupLinkIcon {
  transform: translateX(0px);
  opacity: 1;
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
  font-size: 0.9rem;
  text-decoration: none;
  font-weight: 500;
  color: var(--clr-grey);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.routerLink:hover,
.routerLink:hover .routerLinkDropDownIcon {
  color: var(--clr-blue);
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
  margin-left: 3rem;
  list-style-type: none;
  color: var(--clr-grey);
  display: flex;
  font-family: "Poppins", sans-serif;
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
  transition: 0.15s all;
  border: none;
  outline: none;
  color: var(--clr-grey);
}

.settingsSection:hover .settingsIcon,
.settingsSection:hover {
  cursor: pointer;
  color: var(--clr-blue);
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
}

.nav-container {
  margin: 0 auto;
  width: 95%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-wrapper {
  height: var(--header-height);
  display: flex;
  align-items: center;
  /* border-bottom: 1px solid var(--clr-light-grey); */
  justify-content: space-between;
}

.u-displayflex {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* anim */

.slide-fade-enter-active {
  transition: all 0.25s ease;
}

.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px) scale(1);
  opacity: 0;
}

.router-link-active {
  color: var(--clr-blue);
  font-weight: 500;
}
.router-link-active > img {
  color: var(--clr-blue);
  border: 2px solid var(--clr-blue);
}
.router-link-active > .defaultProfilePic {
  background: rgb(2, 0, 36);
  background-image: linear-gradient(
    to right,
    rgb(89, 149, 210),
    rgb(11, 95, 222) 100%
  );
}

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

@media screen and (min-width: 1150px) {
  .nav-container,
  .nav-container-mobile {
    max-width: 1100px;
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