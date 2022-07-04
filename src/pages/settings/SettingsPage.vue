<template>
  <Header />
  <article class="container">
    <section class="titleAndBackButtonContainer">
      <BackButton />
      <h1>Settings</h1>
    </section>
    <section class="settingsCard__container">
      <section class="settingsCard">
        <h2>Appearance</h2>
        <section class="settingsSection">
          <!-- theme toggle -->
          <label for="theme">Dark mode</label>
          <!-- <input type="checkbox" @change="toggleTheme" value="darkMode" v-model="isDarkThemeOn" id="theme" name="theme" class="themeCheckbox"> -->

          <label class="switch" @click="toggleTheme">
            <input
              type="checkbox"
              id="theme"
              name="theme"
              value="darkMode"
              @change="toggleTheme"
              v-model="isDarkThemeOn"
            />
            <span class="slider round"></span>
          </label>
        </section>
      </section>
      <section v-if="isAuth" class="settingsCard">
        <h2>Other</h2>
        <section class="settingsSection">
          <LogoutButton />
        </section>
      </section>
    </section>
  </article>
</template>

<script>
import Header from "@/components/layout/Header.vue";
import LogoutButton from "@/components/ui/LogoutButton.vue";
import BackButton from "@/components/ui/BackButton.vue";

export default {
  components: {
    Header,
    LogoutButton,
    BackButton,
  },
  data() {
    return {
      isDarkThemeOn: true,
    };
  },
  computed: {
    isAuth() {
      return this.$store.getters['isAuthenticated'];
    },
  },
  methods: {
    toggleTheme() {
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
.titleAndBackButtonContainer {
  margin-bottom: 2rem;
}

label {
  color: var(--clr-dark-grey);
}

.switch {
  position: relative;
  display: inline-block;
  width: 45px;
  height: 22px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--clr-medium-light-grey);
  -webkit-transition: 0.15s ease-in-out;
  transition: 0.15s ease-in-out;
}

.slider:hover {
  background-color: var(--clr-medium-light-grey-2);
}

.slider:before {
  position: absolute;
  content: "";
  height: 15px;
  width: 15px;
  left: 4px;
  bottom: 4px;
  background-color: var(--clr-very-light-blue);
  -webkit-transition: 0.15s ease-in-out;
  transition: 0.15s ease-in-out;
}

input:checked + .slider {
  background-color: var(--clr-blue);
}

input:checked + .slider:before {
  -webkit-transform: translateX(22px);
  -ms-transform: translateX(22px);
  transform: translateX(22px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 200px;
}

.slider.round:before {
  border-radius: 200px;
}

.container {
  margin: 0 auto;
  margin-bottom: 4rem;
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
  background-color: var(--clr-very-light-blue);
  box-shadow: var(--box-shadow-big);
  border-radius: var(--card-border-radius);
  border: 1px solid var(--clr-light-grey);
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

@media screen and (min-width: 1050px) {
  .container {
    max-width: 1100px;
  }
}
</style>