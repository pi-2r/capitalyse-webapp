<template>
  <section class="tooltip__wrapper">
    <Icon icon="dashicons:info" class="tooltip__icon" color="var(--clr-medium-light-grey)" @mouseover="isOpen = true" @mouseleave="isOpen = false"/>
    <transition name="slide-fade" mode="out-in">
      <section class="tooltip__text" v-if="isOpen">
        <slot/>
      </section>
    </transition>
  </section>
</template>

<script>
import { Icon } from '@iconify/vue';

export default {
  components: {
    Icon,
  },
  data() {
    return {
      isOpen: false,
    }
  }
}
</script>

<style scoped>

.tooltip__icon {
  height: 16px;
}

.tooltip__wrapper {
  position: relative;
  display: inline-flex;
}

 .tooltip__wrapper .tooltip__text {
  width: 16rem;
  background-color: var(--clr-black);
  opacity: 0.9;
  color: var(--clr-light-grey);
  text-align: center;
  border-radius: var(--btn-radius);
  padding: 0.4rem 0.4rem;
  position: absolute;
  z-index: 1;
  bottom: 140%;
  font-size: 0.85rem;
  font-weight: 400;
  left: 50%;
  line-height: 1.15rem;
  margin-left: -8rem;
}

.tooltip__wrapper .tooltip__text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: var(--clr-black) transparent transparent transparent;
}


.slide-fade-enter-active {
  transition: all 0.15s ease;
}

.slide-fade-leave-active {
  transition: all 0.1s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
</style>