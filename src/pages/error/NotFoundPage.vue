<template>
  <section class="container">
    <section>
      <Logo />
      <h1>Sorry, this page doesn't exist.</h1>
      <Button link to="/portfolios">To My Portfolios</Button>
    </section>
  </section>
</template>

<script>
import Logo from "@/components/ui/Logo.vue";

export default {
  components: {
    Logo,
  },
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  text-align: center;
}

.container section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
}

h2 {
  color: grey;
}
</style>