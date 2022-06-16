<template>
  <HoldingsPieChartCard
    title="Holdings"
    btnText="My Holdings"
    chartErrorMsg="You currently have no holdings."
    :chartOptions="chartOptions"
    :chartData="holdingsChartData"
    :isLoadingHoldings="isLoadingHoldings"
  />
  <HoldingsPieChartCard
    title="Currencies"
    btnText="My Holdings"
    chartErrorMsg="No currencies found."
    :chartOptions="chartOptions"
    :chartData="currenciesChartData"
    :isLoadingCurrencies="isLoadingCurrencies"
  />
</template>
<script>
import HoldingsPieChartCard from "./HoldingsPieChartCard";

import getPieChartHoldingsMixin from "@/mixins/analytics/getPieChartHoldings";
import getPieChartCurrenciesMixin from "@/mixins/analytics/getPieChartCurrencies";
import cleanNumberMixin from "@/mixins/helpers/cleanNumber";
import includesFromArrayMixin from "@/mixins/helpers/includesFromArray";
import splitDateMixin from "@/mixins/helpers/splitDate";

export default {
  mixins: [
    cleanNumberMixin,
    includesFromArrayMixin,
    splitDateMixin,
    getPieChartCurrenciesMixin,
    getPieChartHoldingsMixin,
  ],
  components: {
    HoldingsPieChartCard,
  },
  data() {
    return {
      isLoadingHoldings: true,
      isLoadingCurrencies: true,
      chartOptions: {
        plugins: {
          legend: {
            display: false,
          },
        },
      },
      holdingsChartData: {
        labels: [],
        datasets: [
          {
            borderWidth: 1,
            borderColor: "white",
            backgroundColor: [],
            data: [],
          },
        ],
      },
      currenciesChartData: {
        labels: [],
        datasets: [
          {
            borderWidth: 1,
            borderColor: "white",
            backgroundColor: [],
            data: [],
          },
        ],
      },
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
  watch: {
    isThereData() {
      this.loadData();
    },
  },
  methods: {
    loadData() {
      if (this.isThereData) {
        this.setCurrenciesData();
        this.setHoldingsData();
      }
    },
    setCurrenciesData() {
      // currencies
      let chartCurrencies = this.getPieChartCurrencies(
        this.currentPortfolio.portfolioFile
      );

      this.setColors(chartCurrencies, this.currenciesChartData);


      if (chartCurrencies === false) {
        this.currenciesChartData.labels = [];
        this.currenciesChartData.datasets[0].data = [];

        this.chartErrorMsg = "No currencies found.";
      } else {
        this.chartErrorMsg = null;
        this.currenciesChartData.labels = chartCurrencies.labels;
        this.currenciesChartData.datasets[0].data = chartCurrencies.data;
      }
    },
    setHoldingsData() {
      // holdings
      let chartHoldings = this.getPieChartHoldings(
        this.currentPortfolio.portfolioFile
      );

      this.setColors(chartHoldings, this.holdingsChartData);

      if (chartHoldings === false) {
        this.holdingsChartData.labels = [];
        this.holdingsChartData.datasets[0].data = [];

        this.chartErrorMsg = "You currently have no holdings.";
      } else {
        this.chartErrorMsg = null;
        this.holdingsChartData.labels = chartHoldings.labels;
        this.holdingsChartData.datasets[0].data = chartHoldings.data;
      }
    },
    setColors(holdings, holdingsData) {
      const colors = [];
      // get lowest and highest holdings

      for (let i = 0; i < holdings.data.length; i++) {
        // number between 220 adn 240
        const randomNumber = Math.floor(Math.random() * (220 - 240 + 1)) + 230;
        let h = randomNumber;
        let s = 70;
        let l = 60;
        let color = "hsl(" + h + ", " + s + "%, " + l + "%)";
        colors.push(color);
      }

      holdingsData.datasets[0].backgroundColor = colors;
    },
  },
  created() {
    this.loadData();
  },
};
</script>
<style scoped>
</style>