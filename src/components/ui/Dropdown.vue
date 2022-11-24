<template>
  <transition name="dropdown-in-out">
    <section v-if="isOpen">
      <section class="overlay" @click="$emit('clickOutsideDropdown')"></section>
      <section
        class="dropdownContent"
        tabindex="0"
      >
        <slot></slot>
      </section>
    </section>
  </transition>
</template>

<script>
export default {
  props: {
    isOpen: {
      default: false,
      type: Boolean,
    },
  },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
}

.dropdownContent {
  position: absolute;
  top: 2.2rem;
  right: 0rem;
  z-index: 100;
  border-radius: var(--btn-radius);
  background-color: var(--clr-very-light-blue);
  border: 1px solid var(--clr-light-grey);
  padding: 0.75rem;
  box-shadow: var(--btn-shadow);
  width: 15rem;
}

/* animation */

.dropdown-in-out-enter-active {
  transition: all 0.2s ease;
}

.dropdown-in-out-leave-active {
  transition: all 0.2s ease;
}

.dropdown-in-out-enter-from,
.dropdown-in-out-leave-to {
  transform: scale(0.3);
  opacity: 0;
}
</style>