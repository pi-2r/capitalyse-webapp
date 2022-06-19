<template>
  <section class="holdingsPieChartContainer">
    <section class="holdingsPieChartWrapper">
      <section class="holdingsPieChartTitle">
        <h2>{{title}}</h2>
        <p class="holdingsPieChartTitle__dataLength">{{dataLength}}</p>
      </section>
      <section class="holdingsPieChart">
        <p v-if="chartErrorMsg">{{chartErrorMsg}}</p>
        <Doughnut v-else class="pieChart" :chartData="chartData" :chartOptions="chartOptions" />
      </section>
      <section class="holdingsPieChart__btnSection">
        <CardButtonArrow class="holdingsPieChart__btn" v-if="showBtn">{{btnText}}</CardButtonArrow>
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
    showBtn: {
      type: Boolean,
      default: true,
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
    dataLength() {
      let total = 0;
      
      for(let i = 0; i < this.chartData.datasets[0].data.length; i++) {
        total++;
        if(this.chartData.labels[i] === 'Cash') {
          total--;
        }
      }
      
      return total;
    },
  },
};
</script>

<style scoped>
.holdingsPieChartTitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.holdingsPieChartTitle__dataLength {
  color: var(--clr-blue);
  font-size: 1.2rem;
  font-weight: 600;
}


.pieChart {
  width: 60%;
  margin-top: 1rem;
}

h2 {
  color: var(--clr-grey);
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
  padding: 1.75rem;
  background-color: var(--clr-very-light-blue);
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow-big);
  border: 1px solid var(--clr-very-light-grey);
}

.holdingsPieChart__btn {
  padding-top: 1rem;
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