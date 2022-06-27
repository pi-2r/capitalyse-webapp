<template>
  <Button class="card link cardBtnSection__btn" link :to="to">
    <slot></slot>
    <Icon
      class="cardBtnSection__btnIcon"
      icon="charm:arrow-right"
      color="var(--clr-dark-grey)"
      height="15"
    />
  </Button>
</template>
<script>
import { Icon } from '@iconify/vue';

export default {
  components: {
    Icon,
  },
  props: {
    btnText: {
      type: String,
      default: "View Details",
    },
    to: {
      type: String,
      default: "#",
    },
  }
};
</script>
<style scoped>
.cardBtnSection__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
}

.cardBtnSection__btnIcon {
    transition: 0.15s all;
}

.cardBtnSection__btn:hover .cardBtnSection__btnIcon {
    transform: scale(1.02) translateX(0.2rem);
}

</style>