<template>
  <article
    class="websiteWrapper"
    @keyup="resetTimer"
    @mousemove="resetTimer"
    @mousedown="resetTimer"
    @touchmove="resetTimer"
    @touchdown="resetTimer"
  >
    <main class="websiteWrapperMain">
      <!-- inactivity modal -->
      <transition name="slide-fade" mode="out-in">
        <ConfirmModal
          v-if="hasTimeRunOut"
          @clickOutsidePopup="hasTimeRunOut = false"
        >
          <h1 class="loginTimeoutModal__title">You've been logged out</h1>
          <p class="loginTimeoutModal__text">
            You have been logged out due to inactivity. Please authenticate yourself again.
          </p>
          <Button class="loginTimeoutModal__btn" @click="hasTimeRunOut = false"
            >Continue</Button
          >
        </ConfirmModal>
      </transition>

      <router-view></router-view>
    </main>
  </article>
</template>

<script>
import ConfirmModal from "@/components/ui/ConfirmModal.vue";
let inactivityTimer;

export default {
  components: { ConfirmModal },
  name: "App",
  data() {
    return {
      timeoutInMs: 10 * 60 * 1000,
      lastMove: 0,
      hasTimeRunOut: false,
    };
  },
  created() {
    window.addEventListener("scroll", this.resetTimer);
    this.$store.dispatch("tryLogin");
    this.startTimer();
  },
  unmounted() {
    window.removeEventListener("scroll", this.resetTimer);
  },
  watch: {
    isAuth() {
      if (this.isAuth) {
        this.fetchAllPortfolios();
      } else {
        this.$router.replace("/login");
      }
    },
  },
  computed: {
    isAuth() {
      return this.$store.getters["isAuthenticated"];
    },
  },
  methods: {
    fetchAllPortfolios() {
      this.$store.dispatch("files/fetchAllPortfolios");
    },
    handleInactive() {
      if (this.isAuth) {
        this.hasTimeRunOut = true;
        console.log("inactive for too long");
        this.$store.dispatch("logout");
      }
    },
    startTimer() {
      inactivityTimer = setTimeout(this.handleInactive, this.timeoutInMs);
    },
    resetTimer() {
      // throttle to every 1 second
      if (Date.now() - this.lastMove > 1000) {
        console.log("reset inactivity timer");
        clearTimeout(inactivityTimer);
        this.startTimer();
        this.lastMove = Date.now();
      }
    },
  },
};
</script>

<style>
.loginTimeoutModal__title {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}
.loginTimeoutModal__text {
  margin-bottom: 1.5rem;
}
.loginTimeoutModal__btn {
  width: 100%;
}
/* * {
  border: 1px solid red;
} */

/* Fonts */
@import url("https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,600&display=swap");

/* Variables */
@import "./assets/styles/variables.css";

::-webkit-scrollbar {
  width: 7px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--clr-medium-light-grey);
  border-radius: var(--btn-radius);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--clr-medium-light-grey-2);
}

.titleAndBackButtonContainer {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 3rem;
}

.websiteWrapperMain {
  min-height: 100vh;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: "Poppins", sans-serif;
  background-color: var(--clr-white);
}

h1 {
  font-size: 2.2rem;
  font-family: "Lexend", sans-serif;
  font-weight: 500;
  margin: 0;
  padding: 0;
  color: var(--clr-black);
  user-select: none;
}

h2 {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  padding: 0;
  color: var(--clr-dark-grey);
}

p,
div {
  color: var(--clr-black);
}

button {
  font-family: "Poppins", sans-serif;
  transition: 0.2s all;
  outline: none;
}

select {
  font-family: "Poppins", sans-serif;
}

input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.material-design-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.greenNumber {
  color: var(--clr-green);
}

.redNumber {
  color: var(--clr-red);
}

.resultValue {
  font-size: 2rem;
  font-weight: 500;
  color: var(--clr-blue);
}

.chartResultValue {
  font-size: 1.5rem;
  font-weight: 500;
}

.u-noselect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.container {
  max-width: 92%;
}

.customUnderline {
  padding: 30px 0 8px;
  position: relative;
}

.customUnderline::before {
  content: "";
  position: absolute;
  bottom: 15px;
  width: 100%;
  height: 5px;
  transform: skew(-29deg);
  background: var(--clr-blue);
  z-index: -1;
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

@media screen and (max-width: 768px) {
  h1 {
    font-size: 1.75rem;
  }
}
</style>
