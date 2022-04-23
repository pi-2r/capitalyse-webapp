<template>

    <Header></Header>
    <main class="container">
        <router-view></router-view>
    </main>

    <!-- <Footer></Footer> -->
</template>

<script>
import Header from './components/layout/Header.vue';
// import Footer from './components/layout/Footer.vue';

export default {
  name: 'App',
  components: {
    Header,
    // Footer
  }
}
</script>

<style>
/* Lexend */
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&display=swap');
/* Variables */
@import './assets/styles/variables.css';

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: 'Lexend', sans-serif;
}

.container {
    max-width: var(--container-width);
    margin: 0 auto;
    margin-top: 6rem;
}

h1 {
    font-size: 3rem;
    font-weight: 500;
    margin: 0;
    padding: 0;
    color: var(--clr-blue);
}

h2 {
    font-size: 1.25rem;
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



@media screen and (min-width: 650px) {
    .container {
        max-width: 90%;
    }
}

@media screen and (min-width: 1050px) {
    .container {
        max-width: 1000px;
    }
}

@media screen and (min-width: 1100px) {
    .container {
        max-width: 1000px;
    }
}
  

  



  
</style>
