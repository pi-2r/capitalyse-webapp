<template>
  <section class="loading-wrapper">
    <div class="loading">
      <div class="loading-text">
        <div class="row">
          <div class="spinner spinner-bounce-bottom"></div>
        </div>
        <br>
        <p> Getting stock market data...</p>
       
        <p>This might take a few seconds.</p>

        <!-- <span class="loading-text-words">L</span>
        <span class="loading-text-words">O</span>
        <span class="loading-text-words">A</span>
        <span class="loading-text-words">D</span>
        <span class="loading-text-words">I</span>
        <span class="loading-text-words">N</span>
        <span class="loading-text-words">G</span> -->
        <!-- <span class="loading-text-words"><Logo :onlyIcon="true" color="var(--clr-grey)" class="logoIcon"/></span> -->
        <!-- <span class="loading-text-words">C</span>
        <span class="loading-text-words">A</span>
        <span class="loading-text-words">P</span>
        <span class="loading-text-words">I</span>
        <span class="loading-text-words">T</span>
        <span class="loading-text-words">A</span>
        <span class="loading-text-words">L</span>
        <span class="loading-text-words">Y</span>
        <span class="loading-text-words">S</span>
        <span class="loading-text-words">E</span> -->

        <!-- <div class="holder">
          <div class="preloader">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div> -->

        <!-- <Spinner/> -->
        <!-- <p class="text">
        loading
        </p> -->
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
    text: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped>
p {
  font-size: 0.85rem;
  color: var(--clr-medium-light-grey-2)
}

.text {
  margin-top: 1rem;
  text-align: center;
}

@media screen and (max-width: 800px) {
  .loading-text-words {
    visibility: hidden;
  }
}

.logoIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(1.25);
  margin-right: 0.25rem;
}

.holder {
  position: absolute;
  left: 0px;
  top: 5rem;
  bottom: 0px;
  right: 0px;
  width: 100%;
  height: 100%;
}

.preloader {
  /* size */
  width: 30px;
  height: 30px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  animation: rotatePreloader 2s infinite ease-in;
}

@keyframes rotatePreloader {
  0% {
    transform: translateX(-50%) translateY(-50%) rotateZ(0deg);
  }
  100% {
    transform: translateX(-50%) translateY(-50%) rotateZ(-360deg);
  }
}
.preloader div {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.preloader div:before {
  content: "";
  position: absolute;
  left: 50%;
  top: 0%;
  width: 10%;
  height: 10%;
  background-color: var(--clr-grey);
  transform: translateX(-50%);
  border-radius: 50%;
}

.preloader div:nth-child(1) {
  transform: rotateZ(0deg);
  animation: rotateCircle1 1.75s infinite linear;
  z-index: 9;
}

@keyframes rotateCircle1 {
  0% {
    opacity: 0;
  }
  0% {
    opacity: 1;
    transform: rotateZ(36deg);
  }
  7% {
    transform: rotateZ(0deg);
  }
  57% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(-324deg);
    opacity: 1;
  }
}
.preloader div:nth-child(2) {
  transform: rotateZ(36deg);
  animation: rotateCircle2 1.75s infinite linear;
  z-index: 8;
}

@keyframes rotateCircle2 {
  5% {
    opacity: 0;
  }
  5.0001% {
    opacity: 1;
    transform: rotateZ(0deg);
  }
  12% {
    transform: rotateZ(-36deg);
  }
  62% {
    transform: rotateZ(-36deg);
  }
  100% {
    transform: rotateZ(-324deg);
    opacity: 1;
  }
}
.preloader div:nth-child(3) {
  transform: rotateZ(72deg);
  animation: rotateCircle3 1.75s infinite linear;
  z-index: 7;
}

@keyframes rotateCircle3 {
  10% {
    opacity: 0;
  }
  10.0002% {
    opacity: 1;
    transform: rotateZ(-36deg);
  }
  17% {
    transform: rotateZ(-72deg);
  }
  67% {
    transform: rotateZ(-72deg);
  }
  100% {
    transform: rotateZ(-324deg);
    opacity: 1;
  }
}
.preloader div:nth-child(4) {
  transform: rotateZ(108deg);
  animation: rotateCircle4 1.75s infinite linear;
  z-index: 6;
}

@keyframes rotateCircle4 {
  15% {
    opacity: 0;
  }
  15.0003% {
    opacity: 1;
    transform: rotateZ(-72deg);
  }
  22% {
    transform: rotateZ(-108deg);
  }
  72% {
    transform: rotateZ(-108deg);
  }
  100% {
    transform: rotateZ(-324deg);
    opacity: 1;
  }
}
.preloader div:nth-child(5) {
  transform: rotateZ(144deg);
  animation: rotateCircle5 1.75s infinite linear;
  z-index: 5;
}

@keyframes rotateCircle5 {
  20% {
    opacity: 0;
  }
  20.0004% {
    opacity: 1;
    transform: rotateZ(-108deg);
  }
  27% {
    transform: rotateZ(-144deg);
  }
  77% {
    transform: rotateZ(-144deg);
  }
  100% {
    transform: rotateZ(-324deg);
    opacity: 1;
  }
}
.preloader div:nth-child(6) {
  transform: rotateZ(180deg);
  animation: rotateCircle6 1.75s infinite linear;
  z-index: 4;
}

@keyframes rotateCircle6 {
  25% {
    opacity: 0;
  }
  25.0005% {
    opacity: 1;
    transform: rotateZ(-144deg);
  }
  32% {
    transform: rotateZ(-180deg);
  }
  82% {
    transform: rotateZ(-180deg);
  }
  100% {
    transform: rotateZ(-324deg);
    opacity: 1;
  }
}
.preloader div:nth-child(7) {
  transform: rotateZ(216deg);
  animation: rotateCircle7 1.75s infinite linear;
  z-index: 3;
}

@keyframes rotateCircle7 {
  30% {
    opacity: 0;
  }
  30.0006% {
    opacity: 1;
    transform: rotateZ(-180deg);
  }
  37% {
    transform: rotateZ(-216deg);
  }
  87% {
    transform: rotateZ(-216deg);
  }
  100% {
    transform: rotateZ(-324deg);
    opacity: 1;
  }
}
.preloader div:nth-child(8) {
  transform: rotateZ(252deg);
  animation: rotateCircle8 1.75s infinite linear;
  z-index: 2;
}

@keyframes rotateCircle8 {
  35% {
    opacity: 0;
  }
  35.0007% {
    opacity: 1;
    transform: rotateZ(-216deg);
  }
  42% {
    transform: rotateZ(-252deg);
  }
  92% {
    transform: rotateZ(-252deg);
  }
  100% {
    transform: rotateZ(-324deg);
    opacity: 1;
  }
}
.preloader div:nth-child(9) {
  transform: rotateZ(288deg);
  animation: rotateCircle9 1.75s infinite linear;
  z-index: 1;
}

@keyframes rotateCircle9 {
  40% {
    opacity: 0;
  }
  40.0008% {
    opacity: 1;
    transform: rotateZ(-252deg);
  }
  47% {
    transform: rotateZ(-288deg);
  }
  97% {
    transform: rotateZ(-288deg);
  }
  100% {
    transform: rotateZ(-324deg);
    opacity: 1;
  }
}
.preloader div:nth-child(10) {
  transform: rotateZ(324deg);
  animation: rotateCircle10 1.75s infinite linear;
  z-index: 0;
}

@keyframes rotateCircle10 {
  45% {
    opacity: 0;
  }
  45.0009% {
    opacity: 1;
    transform: rotateZ(-288deg);
  }
  52% {
    transform: rotateZ(-324deg);
  }
  102% {
    transform: rotateZ(-324deg);
  }
  100% {
    transform: rotateZ(-324deg);
    opacity: 1;
  }
}

.loading {
  width: 100%;
  height: 100%;
  background: var(--clr-white);
  z-index: 9999;
}

/* .loading-text {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -5rem;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
  width: 100%;
  height: 100px;
  line-height: 75px;
} */
.loading-text {
  color: var(--clr-grey);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  flex-direction: column;
  top: -5rem;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
  width: 100%;
  height: 100px;
  /* line-height: 75px; */
}

.loading-text span {
  display: inline-block;
  margin: 0 4px;
  color: var(--clr-grey);
  font-weight: 600;
  font-size: 1.25rem;
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

body {
  background-color: white;
  font-family: "Lato", Arial, sans-serif;
  text-align: center;
  padding-top: 50px;
}

h1 {
  font-size: 1.5em;
  color: #666;
}

h2,
a {
  font-size: 0.8em;
  color: var(--clr-grey);
}

.spinners {
  margin: 60px auto;
}
.spinners .row {
  height: 50px;
  padding: 10px 0;
}

/* ============================ */
/* VARIABLES                    */
/* ============================ */
/* ============================ */
/* SPINNER GENERAL              */
/* ============================ */
.spinner:before,
.spinner:after,
.spinner {
  width: 4px;
  height: 20px;
  background-color: var(--clr-grey);
  border-radius: 2px;
}

.spinner {
  display: inline-block;
  position: relative;
}
.spinner:before,
.spinner:after {
  content: "";
  position: absolute;
  display: block;
  top: 0px;
}
.spinner:before {
  left: -6px;
}
.spinner:after {
  left: 6px;
}

/* ============================ */
/* SPINNER BOUNCE BOTTOM        */
/* ============================ */
@-webkit-keyframes bounce-bottom {
  0% {
    height: 5px;
    margin-top: 15px;
  }
  50% {
    height: 20px;
    margin-top: 0px;
  }
  100% {
    height: 5px;
    margin-top: 15px;
  }
}
@keyframes bounce-bottom {
  0% {
    height: 5px;
    margin-top: 15px;
  }
  50% {
    height: 20px;
    margin-top: 0px;
  }
  100% {
    height: 5px;
    margin-top: 15px;
  }
}
.spinner-bounce-bottom {
  -webkit-animation: bounce-bottom 0.8s ease 0.1s infinite;
  animation: bounce-bottom 0.8s ease 0.1s infinite;
}
.spinner-bounce-bottom:before,
.spinner-bounce-bottom:after {
  top: auto;
  bottom: 0px;
}
.spinner-bounce-bottom:before {
  -webkit-animation: bounce-bottom 0.8s ease 0s infinite;
  animation: bounce-bottom 0.8s ease 0s infinite;
}
.spinner-bounce-bottom:after {
  -webkit-animation: bounce-bottom 0.8s ease 0.2s infinite;
  animation: bounce-bottom 0.8s ease 0.2s infinite;
}

/* ============================ */
/* SPINNER BOUNCE TOP        */
/* ============================ */
@-webkit-keyframes bounce-top {
  0% {
    height: 5px;
    margin-bottom: 15px;
  }
  50% {
    height: 20px;
    margin-bottom: 0px;
  }
  100% {
    height: 5px;
    margin-bottom: 15px;
  }
}
@keyframes bounce-top {
  0% {
    height: 5px;
    margin-bottom: 15px;
  }
  50% {
    height: 20px;
    margin-bottom: 0px;
  }
  100% {
    height: 5px;
    margin-bottom: 15px;
  }
}
.spinner-bounce-top {
  -webkit-animation: bounce-top 0.6s ease 0.1s infinite;
  animation: bounce-top 0.6s ease 0.1s infinite;
}
.spinner-bounce-top:before {
  -webkit-animation: bounce-top 0.6s ease 0s infinite;
  animation: bounce-top 0.6s ease 0s infinite;
}
.spinner-bounce-top:after {
  -webkit-animation: bounce-top 0.6s ease 0.2s infinite;
  animation: bounce-top 0.6s ease 0.2s infinite;
}

/* ============================ */
/* SPINNER BOUNCE MIDDLE        */
/* ============================ */
@-webkit-keyframes bounce-middle {
  0% {
    height: 4px;
    margin-top: 8px;
    margin-bottom: 8px;
  }
  50% {
    height: 20px;
    margin-top: 0px;
    margin-bottom: 0px;
  }
  100% {
    height: 4px;
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
@keyframes bounce-middle {
  0% {
    height: 4px;
    margin-top: 8px;
    margin-bottom: 8px;
  }
  50% {
    height: 20px;
    margin-top: 0px;
    margin-bottom: 0px;
  }
  100% {
    height: 4px;
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
.spinner-bounce-middle {
  -webkit-animation: bounce-middle 0.6s ease 0.1s infinite;
  animation: bounce-middle 0.6s ease 0.1s infinite;
}
.spinner-bounce-middle:before,
.spinner-bounce-middle:after {
  top: 50%;
  transform: translateY(-10px) translateZ(0);
}
.spinner-bounce-middle:before {
  -webkit-animation: bounce-middle 0.6s ease 0s infinite;
  animation: bounce-middle 0.6s ease 0s infinite;
}
.spinner-bounce-middle:after {
  -webkit-animation: bounce-middle 0.6s ease 0.2s infinite;
  animation: bounce-middle 0.6s ease 0.2s infinite;
}

/* ============================ */
/* SPINNER BLINK                */
/* ============================ */
@-webkit-keyframes glow {
  0% {
    background-color: transparent;
  }
  50% {
    background-color: var(--clr-grey);
  }
  100% {
    background-color: transparent;
  }
}
@keyframes glow {
  0% {
    background-color: transparent;
  }
  50% {
    background-color: var(--clr-grey);
  }
  100% {
    background-color: transparent;
  }
}
.spinner-blink {
  -webkit-animation: glow 0.6s 0.1s infinite;
  animation: glow 0.6s 0.1s infinite;
}
.spinner-blink:before {
  -webkit-animation: glow 0.6s 0s infinite;
  animation: glow 0.6s 0s infinite;
}
.spinner-blink:after {
  -webkit-animation: glow 0.6s 0.2s infinite;
  animation: glow 0.6s 0.2s infinite;
}
</style>