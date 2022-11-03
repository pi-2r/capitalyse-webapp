<template>
  <section class="sharedPortfolio">
    <Icon icon="bi:person-fill" />
    <p class="sharedPortfolioText">
      
      {{ displayName || email }}'s shared portfolio
    </p>
  </section>
</template>

<script>
import { Icon } from "@iconify/vue";

export default {
  components: {
    Icon,
  },
  props: {
    displayName: {
      default: "",
    },
    email: {
      default: "",
    },
  },
};
</script>

<style scoped>
.sharedPortfolio {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  color: var(--clr-grey);
  margin-bottom: 3rem;
  margin-top: 3rem;
  padding-bottom: 2rem;
  font-size: 1rem;
  border-bottom: 1px solid var(--clr-light-grey);

}

.sharedPortfolioText {
  color: var(--clr-grey);
  font-weight: 500 !important;
  font-size: 1rem;
}
</style>