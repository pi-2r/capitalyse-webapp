<template>
  <div class="loading-wrapper">
    <div v-if="btnSpinner" class="btnLoader"></div>
    <div v-else class="loader"></div>
  </div>
</template>

<script>
export default {
  props: {
    btnSpinner: {
      type: Boolean,
      default: false
    }
  },
}
</script>

<style scoped>
.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader {
  display: block;
  border: 2px solid var(--clr-black);
  border-radius: 100%;
  border-top: 2px solid transparent;
  border-right: 2px solid transparent;
  border-bottom: 2px solid transparent;
  width: 30px;
  height: 30px;
  animation: spin 0.75s ease-in-out infinite;
}

.btnLoader {
  display: block;
  border: 2px solid white;
  border-radius: 100%;
  border-top: 2px solid transparent;
  border-right: 2px solid transparent;
  border-bottom: 2px solid transparent;
  width: 25px;
  height: 25px;
  animation: spin 0.6s ease-in-out infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>