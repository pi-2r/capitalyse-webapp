<template>
  <div class="loading-wrapper">
    <div class="loader"></div>
  </div>
</template>

<style scoped>
.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader {
  display: block;
  border: 3px solid var(--clr-blue);
  border-radius: 100%;
  border-top: 4px solid transparent;
  border-right: 1px solid transparent;
  border-bottom: 3px solid transparent;
  width: 50px;
  height: 50px;
  animation: spin 0.65s ease infinite;
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