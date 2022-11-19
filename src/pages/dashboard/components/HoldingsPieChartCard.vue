<template>
  <section class="holdingsPieChartWrapper">
    <section class="holdingsPieChartTitle">
      <h2>
        {{ dataLength }} {{ title }} <Tooltip v-if="showTooltip">{{ tooltipText }}</Tooltip>
      </h2>
    </section>
    <section class="holdingsPieChart" v-if="!isLoading">
      <p v-if="chartErrorMsg" class="chartErrorMsg">{{ chartErrorMsg }}</p>
      <Doughnut
        v-else
        class="pieChart"
        :chartData="chartData"
        :chartOptions="chartOptions"
      />
    </section>
    <section v-else>
      <Spinner class="spinner" />
    </section>
    <section class="holdingsPieChart__btnSection">
      <CardButtonArrow class="holdingsPieChart__btn" v-if="showBtn">{{
        btnText
      }}</CardButtonArrow>
    </section>
  </section>
</template>

<script>
import { Doughnut } from "vue-chartjs";
import { Chart, ArcElement } from "chart.js";

import CardButtonArrow from "@/components/ui/CardButtonArrow.vue";

Chart.register(ArcElement);

export default {
  components: {
    Doughnut,
    CardButtonArrow,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    showBtn: {
      type: Boolean,
      default: true,
    },
    btnText: {
      type: String,
      default: "View Details",
    },
    showTooltip: {
      default: false,
      type: Boolean,
    },
    tooltipText: {
      default: "No explanation yet.",
      type: String,
    },
    chartOptions: {
      type: Object,
      default: () => ({}),
    },
    chartData: {
      type: Object,
      default: () => ({}),
    },
    isLoading: {
      type: Boolean,
    },
    width: {
      type: Number,
      default: 200,
    },
    height: {
      type: Number,
      default: 200,
    },
  },
  data() {
    return {
      dataHolder: [],
      labelsHolder: [],
    };
  },
  computed: {
    dataLength() {
      return this.chartData.datasets[0].data.length;
    },
    chartErrorMsg() {
      if(this.dataLength === 0 && !this.isLoading) {
        return 'No data'
      } else {
        return null
      }
    }
  },
};
</script>

<style scoped>
.spinner {
  height: 15rem;
}

.pieChart {
  width: 90%;
}

.holdingsPieChartTitle {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  align-items: center;
}

.holdingsPieChartTitle__dataLength {
  color: var(--clr-grey);
  font-size: 1rem;
  font-weight: 600;
}


h2 {
  color: var(--clr-grey);
}

.chartErrorMsg {
  margin-top: 4rem;
  margin-bottom: 4rem;
  color: var(--clr-grey);
}

.spinnerContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.holdingsPieChart {
  display: flex;
  justify-content: center;
  align-items: center;
}

.holdingsPieChartWrapper {
  width: 100%;
  min-width: 18rem;
}

.holdingsPieChart__btn {
  padding-top: 1rem;
}

.noDataMsg {
  text-align: center;
  color: var(--clr-blue);
  margin-top: 6rem;
  margin-bottom: 2rem;
}

.chartResultValue {
  font-size: 1.5rem;
  font-weight: 600;
}

.btnActive {
  background-color: var(--clr-very-light-blue);
  color: var(--clr-blue);
  transform: translateY(0px);
  font-weight: 600;
  border: 1px solid var(--clr-blue);
}

/* anims */
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