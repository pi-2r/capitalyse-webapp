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
  border: 5px solid var(--clr-blue);
  border-radius: 100%;
  border-top: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid transparent;
  width: 50px;
  height: 50px;
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