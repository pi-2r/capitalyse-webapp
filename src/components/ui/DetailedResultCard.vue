<template>
  <Card class="cardContainer">
    <section :class="{ cardContentNoBtn: !withBtn, cardContent: withBtn }">
      <h2>
        {{ title }} <Tooltip v-if="showTooltip">{{ tooltipText }}</Tooltip>
      </h2>
      <transition name="slide-fade" mode="out-in">
        <p class="cardText" :key="resultValue">
          <span
            class="resultValue"
            :class="[
              { redNumber: isNegative },
              { greenNumber: !isNegative && colorType == 'greenRed' },
            ]"
          >
            <span>{{
              Intl.NumberFormat("nl-nl", {
                style: "currency",
                currency: "EUR",
              }).format(resultValue)
            }}</span>
          </span>
        </p>
      </transition>

      <transition name="slide-fade" mode="out-in">
        <p class="subCardText" :key="subResultValue">
          <span class="subResultValue">
            <span>{{ subResultValuePrefix }} </span>
            <span
              :class="{
                redNumber: isNegative,
                greenNumber: !isNegative && colorType == 'greenRed',
              }"
            >
              <span v-if="isSubResultACurrency">
                {{
                  " " +
                  Intl.NumberFormat("nl-nl", {
                    style: "currency",
                    currency: "EUR",
                  }).format(subResultValue)
                }}
              </span>
              <span v-else>
                {{ Intl.NumberFormat("nl-nl").format(subResultValue) }}
              </span>
            </span>
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
  </Card>
</template>

<script>
import { Icon } from "@iconify/vue";
import Card from "@/components/ui/Card.vue";
import Tooltip from "@/components/ui/Tooltip.vue";

export default {
  components: {
    Icon,
    Tooltip,
    Card,
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
    showTooltip: {
      default: false,
      type: Boolean,
    },
    tooltipText: {
      type: String,
      default: "No explanation yet",
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
    isSubResultACurrency: {
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
      try {
      return (
        this.resultValue < 0 ||
        this.resultValue.toLocaleString("de-DE").includes("-")
      );
      }catch(e) {
        return false
      }
    },
    isPositive() {
        try {
      return (
        this.resultValue > 0 ||
        this.resultValue.toLocaleString("de-DE").includes("+")
      );
       }catch(e) {
        return false
      }
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
}

.resultValue {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--clr-dark-grey);
}

.subResultValue {
  font-size: 0.9rem;
  font-weight: 400;
  color: var(--clr-dark-grey);
}

.cardContent {
  padding: 1.25rem;
  padding-bottom: 0rem;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.cardContentNoBtn {
  padding: 1.25rem;
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
  transition: 0.15s all;
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