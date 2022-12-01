<template>
  <section>
    <section class="footer">
      <Logo color="var(--clr-medium-light-grey-2)" />
      <p class="footerText">
        Made in
        
        <Tooltip height="0.75rem" icon="twemoji:flag-netherlands">
        Capitalyse is based in North-Holland, The Netherlands.
        </Tooltip>
        
      </p>
    </section>
  </section>
</template>

<script>
import Tooltip from "@/components/ui/Tooltip.vue";
// import { Icon } from "@iconify/vue";
export default {
  components: {
    Tooltip,
    // Icon,
  },
};
</script>

<style scoped>
.footerText {
  color: var(--clr-medium-light-grey-2);
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.footer {
    margin-bottom: 4rem;
  margin-top: 10rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
}
</style>