<template>
<section class="sharedPortfolioWrapper">
  
  <section class="sharedPortfolio">
    <Icon icon="bi:person-fill" />
    <p class="sharedPortfolioText">
      
      
      Shared by {{ displayName }}
    </p>
  </section>
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
.sharedPortfolioWrapper {
  display: flex;
  padding-top:0.5rem;
  padding-bottom: 0.5rem;
  justify-content: flex-start;
}

.sharedPortfolio {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  color: var(--clr-medium-light-grey-2);
  font-size: 0.9rem;
}

.sharedPortfolioText {
  color: var(--clr-medium-light-grey-2);
}
</style>