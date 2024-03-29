<template>
  <Card>
    <section :class="{ cardContentNoBtn: !withBtn, cardContent: withBtn }">
      <h2>
        {{ title }}
        <Tooltip v-if="showTooltip">{{ tooltipText }}</Tooltip>
      </h2>
      <transition name="slide-fade" mode="out-in">
        <p class="cardText" :key="resultValue">
          <span class="resultValue">
            <span v-if="numberResult">
              <span
                v-if="isPercentage"
                :class="[
                  { redNumber: isNegative && !isZero },
                  { greenNumber: !isNegative && colorType == 'greenRed' && !isZero },
                ]"
              >
                {{ Intl.NumberFormat("nl-nl").format(resultValue) }}%
              </span>
              <span
                v-else
                :class="[
                  { redNumber: isNegative && !isZero },
                  { greenNumber: !isNegative && colorType == 'greenRed' && !isZero },
                ]"
              >
                {{
                  Intl.NumberFormat("nl-nl", {
                    style: "currency",
                    currency: "EUR",
                  }).format(resultValue)
                }}
              </span>
            </span>
            <span
              v-else
              :class="{
                textResult: !numberResult,
                blueTextResult: largeBlueText,
              }"
              >{{ resultValue }}</span
            >
          </span>
        </p>
      </transition>
    </section>
    <section class="cardBtnSection" v-if="withBtn">
      <CardButtonArrow :to="to">
        {{ btnText }}
      </CardButtonArrow>
    </section>
  </Card>
</template>

<script>
import CardButtonArrow from "../ui/CardButtonArrow.vue";
import Card from "@/components/ui/Card.vue";
import Tooltip from "@/components/ui/Tooltip.vue";

export default {
  components: {
    CardButtonArrow,
    Card,
    Tooltip,
  },
  props: {
    withBtn: {
      type: Boolean,
      default: false,
    },
    isPublic: {
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
    colorType: {
      type: String,
    },
    to: {
      type: String,
      default: "/",
    },
    toPublic: {
      type: String,
      default: "/",
    },
    btnText: {
      type: String,
      default: "View Details",
    },
    isPercentage: {
      default: false,
      type: Boolean,
    },
    showTooltip: {
      default: false,
      type: Boolean,
    },
    tooltipText: {
      type: String,
      default: "No explanation yet",
    },
    numberResult: {
      type: Boolean,
      default: true,
    },
    largeBlueText: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    // laat weten of het resultaat negatief is met true of false
    // checkt of waarde negatief is OF of er een minus in de waarde staat
    isNegative() {
      return (
        this.resultValue < 0 ||
        this.resultValue.toLocaleString("de-DE").includes("-")
      );
    },
    isZero() {
      return this.resultValue === 0
    }
  },
};
</script>

<style scoped>
h2 {
  text-align: center;
  color: var(--clr-grey)
}

.textResult {
  font-size: 1rem;
  color: var(--clr-black);
}
.greenNumber {
  color: var(--clr-green);
}
.blueTextResult {
  font-size: 1.5rem;
  color: var(--clr-dark-grey);
}
.resultValue {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--clr-dark-grey);
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
  margin-bottom: 0.5rem;
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
  transition: 0.15s all;
}

.cardBtnSection__btn:hover .cardBtnSection__btnIcon {
  transform: scale(1.02) translateX(0.2rem);
}

.redNumber {
  color: var(--clr-red);
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