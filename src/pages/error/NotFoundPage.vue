<template>
  <section class="container">
    <section class="content">
        <section class="logo">
          <Logo />
        </section>
        <h2>Sorry, this page doesn't exist.</h2>
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
};
</script>

<style scoped>
.content {
  padding: 1.75rem;
   display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

h2 {
  color: grey;
  font-size: 2rem;
}
</style>