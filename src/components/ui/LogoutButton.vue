<template>
  <button class="logoutWrapper" @click="logoutUser">
    <Icon
      icon="ic:baseline-log-out"
      class="logout"
      color="var(--clr-red)"
      height="16"
    />
    Sign out
  </button>
</template>

<script>
import { Icon } from "@iconify/vue";

export default {
  components: {
    Icon,
  },
  methods: {
    logoutUser() {
      // als er op de knop wordt geklikt, log de gebruiker uit
      this.$store.dispatch("logout");
      // en navigeer naar onderstaande pagina
      this.$router.replace("/login");
    },
  },
};
</script>

<style scoped>
.logoutWrapper {
  display: flex;
  width: 9rem;
  justify-content: center;
  gap: 0.5rem;
  align-items: center;
  padding: 0.4rem;
  border-radius: var(--btn-radius);
  transition: 0.15s all;
  background-color: rgba(255, 0, 0, 0.075);
  border: 1px solid var(--clr-red);
  box-shadow: var(--btn-shadow);
  color: var(--clr-red);
  font-size: 1rem;
  font-weight: 500;
}

.logoutWrapper:hover {
  cursor: pointer;
  box-shadow: 1px 1px 8px rgba(251, 122, 122, 0.246);
}

.logout {
  display: inline-block;
  color: var(--clr-red);
  transition: 0.15s all;
}

.logout:hover {
  cursor: pointer;
}
</style>