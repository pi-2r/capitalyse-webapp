<template>
  <HoldingsPieChartCard
    title="Holdings"
    btnText="My Holdings"
    :showBtn="false"
    chartErrorMsg="You currently have no holdings."
    :chartOptions="chartOptions"
    :chartData="holdingsChartData"
    :isLoadingHoldings="isLoadingHoldings"
  />
  <HoldingsPieChartCard
    title="Currencies"
    btnText="My Holdings"
    :showBtn="false"
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
          tooltip: {
            cornerRadius: 5,
            usePointStyle: true,
            displayColors: false,
            titleFont: {weight: 'normal'},
            titleColor: 'grey',
            bodyColor: 'grey',
            backgroundColor: 'rgb(260, 260, 260)',
            borderColor: 'grey',
            borderWidth: 1,
            padding: 7,
            enabled: true,
            callbacks: {
              title: function(value) {
                return `${value[0].label}`;
              },
              label: function(value) {
                return `€${value.formattedValue}`;
              },
            }
          }
        },
      },
      holdingsChartData: {
        labels: [],
        datasets: [
          {
            borderWidth: 4,
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
            borderWidth: 4,
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
    setTheme() {
      const theme = localStorage.getItem("theme");
      if (theme === "dark") {
        this.currenciesChartData.datasets[0].borderColor = "rgb(45, 45, 45)";
        this.holdingsChartData.datasets[0].borderColor = "rgb(45, 45, 45)";
      } else {
        this.currenciesChartData.datasets[0].borderColor = "white";
        this.holdingsChartData.datasets[0].borderColor = "white";
      }
    },
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

      for (let i = 0; i < holdings.data.length; i++) {
        // number between 220 adn 240
        const randomNumber = Math.floor(Math.random() * (220 - 240 + 1)) + 230;
        let h = randomNumber;
        let s = 85;
        let l = 60;
        let color = "hsl(" + h + ", " + s + "%, " + l + "%)";
        colors.push(color);
      }

      holdingsData.datasets[0].backgroundColor = colors;
    },
  },
  created() {
    this.loadData();
    this.setTheme();
  },
};
</script>
<style scoped>
.asdf {
  color: grey;
}
</style>