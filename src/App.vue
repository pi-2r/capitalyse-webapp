<template>
  <article class="websiteWrapper">    
    <main class="websiteWrapperMain">
      <router-view></router-view>
    </main>
    <!-- <Footer></Footer> -->
  </article>
</template>

<script>
// import Header from './components/layout/Header.vue';
// import Footer from './components/layout/Footer.vue';

export default {
  name: 'App',
  components: {
    // Header,
    // Footer
  },
  created() {
    this.$store.dispatch('tryLogin');
  }
}
</script>

<style>
/* Lexend */
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');



/* Variables */
@import './assets/styles/variables.css';



.websiteWrapperMain {
  min-height: 100vh;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: 'Poppins', sans-serif;
  background-color: var(--clr-white);
}

h1 {
    font-size: 2.25rem;
    font-family: 'Lexend', sans-serif;
    font-weight: 500;
    margin: 0;
    padding: 0;
    color: var(--clr-blue);
    user-select: none;
}

h2 {
    font-size: 1.2rem;
    font-weight: 500;
    margin: 0;
    padding: 0;
    color: var(--clr-black);
}

p, div {
    color: var(--clr-black);
}

button {
  transition: 0.2s all;
  outline: none;
}

input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}

.material-design-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.greenNumber {
    color: var(--clr-green);
}

.redNumber {
    color: var(--clr-red);
}

.resultValue {
    font-size: 2rem;
    font-weight: 500;
    color: var(--clr-blue);
}

.chartResultValue {
    font-size: 1.5rem;
    font-weight: 500;
}

.u-noselect {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.container {
    max-width: 92%;
}

/* anim */

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

@media screen and (max-width: 768px) {
    h1 {
        font-size: 1.75rem;
    }
}
</style>
