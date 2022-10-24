<template>
  <Header />
   <transition name="bttIn" mode="out-in" appear>
  <article class="container">
    <section class="titleAndBackButtonContainer">
      <BackButton />
      <h1>Account</h1>
    </section>
    <section class="settingsCard__container">
      <Card class="settingsCard">
        <h2>Appearance</h2>
        <section class="settingsSection">
          <!-- theme toggle -->
          <label for="theme">Dark mode</label>
          <ToggleButton
            id="theme"
            name="theme"
            :is-on="isDarkThemeOn"
            @toggle-button-clicked="toggleTheme"
          />
        </section>
      </Card>
      <Card v-if="isAuth" class="settingsCard">
        <h2>Other</h2>
        <section class="settingsSection">
          <LogoutButton />
        </section>
      </Card>
    </section>
  </article>
  </transition>
</template>

<script>
import Card from "@/components/ui/Card.vue";
import ToggleButton from "@/components/ui/ToggleButton.vue";
import Header from "@/components/layout/Header.vue";
import LogoutButton from "@/components/ui/LogoutButton.vue";
import BackButton from "@/components/ui/BackButton.vue";

export default {
  components: {
    Header,
    LogoutButton,
    BackButton,
    Card,
    ToggleButton,
  },
  data() {
    return {
      isDarkThemeOn: true,
    };
  },
  computed: {
    isAuth() {
      return this.$store.getters["isAuthenticated"];
    },
  },
  methods: {
    toggleTheme() {
      this.isDarkThemeOn = !this.isDarkThemeOn;

      if (this.isDarkThemeOn) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }

      const root = document.querySelector(":root");
      root.setAttribute("data-theme", localStorage.getItem("theme"));
    },
    getTheme() {
      const theme = localStorage.getItem("theme");

      if (theme === "dark") {
        this.isDarkThemeOn = true;
      } else {
        this.isDarkThemeOn = false;
      }
    },
  },
  created() {
    this.getTheme();
  },
};
</script>

<style scoped>
.bttIn-enter-active,
.bttIn-leave-active {
  transform: translateY(0px);
  transition: 0.2s ease;
}

.bttIn-enter-from {
  transform: translateY(20px);
  opacity: 0.2;
}
.bttIn-leave-to {
  display: none;
}


.titleAndBackButtonContainer {
  margin-bottom: 2rem;
}

label {
  color: var(--clr-dark-grey);
}

.container {
  margin: 0 auto;
  margin-bottom: 4rem;
  min-height: 85vh;
  margin-top: 3rem;
  width: 30rem;
}

.themeCheckbox {
  display: block;
  appearance: checkbox;
  -webkit-appearance: checkbox;
  -moz-appearance: checkbox;
  -ms-appearance: checkbox;
  -o-appearance: checkbox;
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
}

h2 {
  margin-bottom: 1rem;
}

.settingsCard {
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.settingsSection {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--clr-light-grey);
  padding-top: 1rem;
  margin-top: 1rem;
}

@media screen and (min-width: 400px) {
  .container {
    max-width: 92%;
  }
}

@media screen and (min-width: 650px) {
  .container {
    max-width: 90%;
  }
}

@media screen and (min-width: 1150px) {
  .container {
    max-width: 1100px;
  }
}
</style>