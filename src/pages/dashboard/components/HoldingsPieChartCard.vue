<template>
  <section class="holdingsPieChartContainer">
    <section class="holdingsPieChartWrapper">
      <h2>{{title}}</h2>
      <section class="holdingsPieChart">
        <p v-if="chartErrorMsg">{{chartErrorMsg}}</p>
        <Doughnut v-else class="pieChart" :chartData="chartData" :chartOptions="chartOptions" />
      </section>
      <section class="holdingsPieChart__btnSection">
        <CardButtonArrow>{{btnText}}</CardButtonArrow>
      </section>
    </section>
  </section>
</template>

<script>
import { Doughnut } from "vue-chartjs";
import { Chart, ArcElement } from "chart.js";

import getPieChartHoldingsMixin from "@/mixins/analytics/getPieChartHoldings";
import cleanNumberMixin from "@/mixins/helpers/cleanNumber";
import includesFromArrayMixin from "@/mixins/helpers/includesFromArray";
import splitDateMixin from "@/mixins/helpers/splitDate";

import CardButtonArrow from "@/components/ui/CardButtonArrow.vue";

Chart.register(ArcElement);

export default {
  mixins: [
    cleanNumberMixin,
    includesFromArrayMixin,
    splitDateMixin,
    getPieChartHoldingsMixin,
  ],
  components: {
    Doughnut,
    CardButtonArrow,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    btnText: {
      type: String,
      default: "View Details",
    },
    chartOptions: {
      type: Object,
      default: () => ({}),
    },
    chartData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isLoading: true,
      chartErrorMsg: null,
      dataHolder: [],
      labelsHolder: [],
     
    };
  },
  computed: {
    currentPortfolio() {
      return this.$store.getters["files/getCurrentPortfolio"];
    },
    isThereData() {
      return !!this.currentPortfolio.portfolioFile;
    },
  },
};
</script>

<style scoped>
.holdingsPieChart__btnSection {
  padding-top: 1rem;
}

.pieChart {
  width: 60%;
  margin-top: 2rem;
}

h2 {
  color: var(--clr-dark-grey);
}

.chartErrorMsg {
  margin-top: 2rem;
  margin-bottom: 2rem;
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
  width: 100%;
  height: 100%;
}

.holdingsPieChartWrapper {
  padding: 2rem;
  background-color: var(--clr-very-light-blue);
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow-big);
  border: 1px solid var(--clr-very-light-grey);
}

.dividendChartHeading {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dividendChartHeading p {
  text-align: right;
}

.dividendChart {
  width: 100%;
  height: 20rem;
  background-color: var(--clr-very-light-blue);
  border-radius: 0rem;
  margin-bottom: 1.5rem;
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

.timeFrame__buttons {
  margin-bottom: 0.5rem;
  display: flex;
}

.timeFrame__btn {
  padding: 0.6rem 0.85rem;
  font-weight: 600;
  font-size: 0.85rem;
  margin-right: 0.5rem;
  background-color: var(--clr-very-light-blue);
  color: var(--clr-grey);
  transform: translateY(0px);
  border: 1px solid var(--clr-medium-light-grey);
  border-radius: var(--btn-radius);
  user-select: none;
  box-shadow: var(--btn-shadow);
}

.timeFrame__btn:hover {
  cursor: pointer;
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

@media screen and (max-width: 550px) {
  .timeFrame__buttons {
    overflow-x: scroll;
  }

  .timeFrame__btn {
    min-width: 6rem;
  }
}
</style>