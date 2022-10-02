<template>
  <section class="loading-wrapper">
    <div class="loading">
      <div class="loading-text">
        <!-- <span class="loading-text-words">L</span>
        <span class="loading-text-words">O</span>
        <span class="loading-text-words">A</span>
        <span class="loading-text-words">D</span>
        <span class="loading-text-words">I</span>
        <span class="loading-text-words">N</span>
        <span class="loading-text-words">G</span> -->
        <span class="loading-text-words">C</span>
        <span class="loading-text-words">A</span>
        <span class="loading-text-words">P</span>
        <span class="loading-text-words">I</span>
        <span class="loading-text-words">T</span>
        <span class="loading-text-words">A</span>
        <span class="loading-text-words">L</span>
        <span class="loading-text-words">Y</span>
        <span class="loading-text-words">S</span>
        <span class="loading-text-words">E</span>
        <Spinner color="blue"/>
         <!-- <span class="loading-text-words">A</span>
        <span class="loading-text-words">N</span>
        <span class="loading-text-words">A</span>
        <span class="loading-text-words">L</span>
        <span class="loading-text-words">Y</span>
        <span class="loading-text-words">S</span>
        <span class="loading-text-words">I</span>
        <span class="loading-text-words">N</span>
        <span class="loading-text-words">G</span> -->
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    btnSpinner: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.loading {
  width: 100%;
  height: 100%;
  background: var(--clr-white);
  z-index: 9999;
}

.loading-text {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
  width: 100%;
  height: 100px;
  line-height: 50px;
}
.loading-text span {
  display: inline-block;
  margin: 0 5px;
  color: var(--clr-blue);
  font-weight: 500;
  font-family: "Poppins", sans-serif;
}
.loading-text span:nth-child(1) {
  filter: blur(0px);
  -webkit-animation: blur-text 0.54s 0s infinite linear alternate;
  animation: blur-text 0.54s 0s infinite linear alternate;
}
.loading-text span:nth-child(2) {
  filter: blur(0px);
  -webkit-animation: blur-text 0.54s 0.1s infinite linear alternate;
  animation: blur-text 0.54s 0.1s infinite linear alternate;
}
.loading-text span:nth-child(3) {
  filter: blur(0px);
  -webkit-animation: blur-text 0.54s 0.2s infinite linear alternate;
  animation: blur-text 0.54s 0.2s infinite linear alternate;
}
.loading-text span:nth-child(4) {
  filter: blur(0px);
  -webkit-animation: blur-text 0.54s 0.3s infinite linear alternate;
  animation: blur-text 0.54s 0.3s infinite linear alternate;
}
.loading-text span:nth-child(5) {
  filter: blur(0px);
  -webkit-animation: blur-text 0.54s 0.4s infinite linear alternate;
  animation: blur-text 0.54s 0.4s infinite linear alternate;
}
.loading-text span:nth-child(6) {
  filter: blur(0px);
  -webkit-animation: blur-text 0.54s 0.5s infinite linear alternate;
  animation: blur-text 0.54s 0.5s infinite linear alternate;
}
.loading-text span:nth-child(7) {
  filter: blur(0px);
  -webkit-animation: blur-text 0.54s 0.6s infinite linear alternate;
  animation: blur-text 0.54s 0.6s infinite linear alternate;
}
.loading-text span:nth-child(8) {
  filter: blur(0px);
  -webkit-animation: blur-text 0.54s 0.7s infinite linear alternate;
  animation: blur-text 0.54s 0.7s infinite linear alternate;
}
.loading-text span:nth-child(9) {
  filter: blur(0px);
  -webkit-animation: blur-text 0.54s 0.8s infinite linear alternate;
  animation: blur-text 0.54s 0.8s infinite linear alternate;
}
.loading-text span:nth-child(10) {
  filter: blur(0px);
  -webkit-animation: blur-text 0.54s 0.9s infinite linear alternate;
  animation: blur-text 0.54s 0.9s infinite linear alternate;
}

@-webkit-keyframes blur-text {
  0% {
    filter: blur(0px);
  }
  100% {
    filter: blur(2px);
  }
}

@keyframes blur-text {
  0% {
    filter: blur(0px);
  }
  100% {
    filter: blur(2px);
  }
}

</style>