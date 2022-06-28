<template>
  <section v-if="!hasAlreadyShownOverlay">
    <transition name="slide-fade" mode="in-out">
      <section v-if="demoOverlayIsOpen" class="demoOverlay__backdrop"></section>
    </transition>
    <section class="demoOverlay__contentContainer" v-if="demoOverlayIsOpen">
      <section class="demoOverlay__content">
        <h2 class="demoOverlay__title">Capitalyse Demo</h2>
        <p class="demoOverlay__text">
          Hey there! In this demo you'll be able to see all Capitalyse has to
          offer for you. <br /><br />Upload your own DEGIRO portfolio to see
          personal tracking and insights.
        </p>
        <button @click="closeDemoOverlay" class="demoOverlay__continueBtn">
          Continue to demo
          <Icon
            class="demoOverlay__continueBtnIcon"
            icon="charm:arrow-right"
            color="var(--clr-blue)"
            height="15"
          />
        </button>
      </section>
    </section>
  </section>
</template>
<script>
import { Icon } from "@iconify/vue";

export default {
  components: {
    Icon,
  },
  data() {
    return {
      demoOverlayIsOpen: true,
    };
  },
  computed: {
    hasAlreadyShownOverlay() {
      return localStorage.getItem("hasAlreadyShownOverlay");
    },
  },
  methods: {
    closeDemoOverlay() {
      this.demoOverlayIsOpen = false;
      localStorage.setItem("hasAlreadyShownOverlay", true);
    },
  },
};
</script>
<style scoped>
.demoOverlay__backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 9999;
}

.demoOverlay__contentContainer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.demoOverlay__content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 85%;
  max-width: 500px;
  z-index: 10000;
}

.demoOverlay__title {
  color: rgb(237, 237, 237);
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.demoOverlay__text {
  color: rgb(213, 213, 213);
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.demoOverlay__continueBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  background-color: rgba(0, 76, 255, 0.109);
  color: var(--clr-blue);
  border: 1px solid var(--clr-blue);
  border-radius: var(--btn-radius);
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.demoOverlay__continueBtnIcon {
  transition: 0.1s all;
}

.demoOverlay__continueBtn:hover .demoOverlay__continueBtnIcon {
  transform: translateX(3px);
}

.slide-fade-enter-active {
  transition: all 0.15s ease;
}

.slide-fade-leave-active {
  transition: all 0.5s ease-in-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
</style>