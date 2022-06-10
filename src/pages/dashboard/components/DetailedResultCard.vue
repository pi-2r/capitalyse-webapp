<template>
  <div class="cardContainer">
    <section :class="{ cardContentNoBtn: !withBtn, cardContent: withBtn }">
      <h2>{{ title }}</h2>
      <transition name="slide-fade" mode="out-in">
        <p class="cardText" :key="resultValue">
          <span
            class="resultValue"
            :class="[
              { redNumber: isNegative },
              { greenNumber: !isNegative && colorType == 'greenRed' },
            ]"
          >
            <span v-if="numberResult">€</span>
            <span>{{ resultValue }}</span>
          </span>
        </p>
      </transition>

      <transition name="slide-fade" mode="out-in">
        <p class="subCardText" :key="subResultValue">
          <span class="subResultValue">
            <span>{{ subResultValuePrefix }}</span>
            <span
              :class="{
                redNumber: isNegative,
                greenNumber: !isNegative && colorType == 'greenRed',
              }"
              >{{ subResultValue }}</span
            >
            <span
              :class="{
                redNumber: isNegative,
                greenNumber: !isNegative && colorType == 'greenRed',
              }"
              >{{ subResultValuePostfix }}</span
            >
          </span>
        </p>
      </transition>
    </section>
    <section class="cardBtnSection" v-if="withBtn">
      <Button class="card link cardBtnSection__btn" link :to="to">
        {{ btnText }}
        <Icon
          class="cardBtnSection__btnIcon"
          icon="charm:arrow-right"
          color="var(--clr-blue)"
          height="15"
        />
      </Button>
    </section>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";

export default {
  components: {
    Icon,
  },
  props: {
    withBtn: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Title",
    },
    resultValue: {
      default: 0,
    },
    subResultValue: {
      default: 0,
    },
    subResultValuePrefix: {
      default: "",
    },
    subResultValuePostfix: {
      default: "",
    },
    to: {
      type: String,
      default: "/",
    },
    btnText: {
      type: String,
      default: "View Details",
    },
    numberResult: {
      type: Boolean,
      default: true,
    },
    colorType: {
      type: String,
      default: "",
    },
  },
  computed: {
    isNegative() {
      return (
        this.resultValue < 0 ||
        this.resultValue.toLocaleString("de-DE").includes("-")
      );
    },
    isPositive() {
      return (
        this.resultValue > 0 ||
        this.resultValue.toLocaleString("de-DE").includes("+")
      );
    },
  },
};
</script>

<style scoped>
h2 {
  text-align: center;
  color: var(--clr-grey);
}

.textResult {
  font-size: 1rem;
  color: var(--clr-black);
}

.cardContainer {
  width: 100%;
  background-color: var(--clr-very-light-blue);
  display: flex;
  justify-content: center;
  border-radius: var(--card-border-radius);
  flex-direction: column;
  box-shadow: var(--box-shadow-big);
  border: 1px solid var(--clr-very-light-grey);
}

.resultValue {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--clr-blue);
}

.subResultValue {
  font-size: 0.9rem;
  font-weight: 400;
  color: var(--clr-blue);
}

.cardContent {
  padding: 1.5rem;
  padding-bottom: 0rem;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.cardContentNoBtn {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.cardText {
  text-align: center;
}

.cardBtnSection {
  padding: 1rem;
  padding-top: 0;
}

.cardBtnSection__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

.cardBtnSection__btnIcon {
  transition: 0.2s all;
}

.cardBtnSection__btn:hover .cardBtnSection__btnIcon {
  transform: scale(1.02) translateX(0.2rem);
}

.redNumber {
  color: var(--clr-red);
}

.greenNumber {
  color: var(--clr-green);
}

.slide-fade-enter-active {
  transition: all 0.15s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.15s ease-in;
}
.slide-fade-enter-from {
  transform: translateY(-15px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(15px);
  opacity: 0;
}
</style>