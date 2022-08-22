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

export default {
  mixins: [
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
      chartHoldings: null,
      chartOptions: {
        onClick: this.pieChartClickEvent,
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
    $route() {
      this.loadData();
    }
  },
  methods: {
    pieChartClickEvent(event, data) {
      // check of niet buiten de chart klikt
      if(data.length > 0){
        if(event.chart.tooltip.title[0].length !== 3) {
          this.$router.push('/dashboard/' + this.$route.params.id + '/holdings/' + this.chartHoldings.isin[data[0].index]);
        } 
      }
    },
    setTheme() {
      const theme = localStorage.getItem("theme");
      if (theme === "dark") {
        this.currenciesChartData.datasets[0].borderColor = "rgb(45, 45, 45)";
        this.holdingsChartData.datasets[0].borderColor = "rgb(45, 45, 45)";
        this.chartOptions.plugins.tooltip.backgroundColor = 'rgb(52, 52, 52)';
      } else {
        this.currenciesChartData.datasets[0].borderColor = "white";
        this.holdingsChartData.datasets[0].borderColor = "white";
      }
    },
    loadData() {
      if (this.isThereData) {
        // bereken data voor de holdings pie chart en de currencies pie chart
        this.setCurrenciesData();
        this.setHoldingsData();
      }
    },
    setCurrenciesData() {
      // currencies
      let chartCurrencies = this.getPieChartCurrencies(
        this.currentPortfolio.portfolioFile
      );

      // voeg voor elke currency een kleur toe
      this.setColors(chartCurrencies, this.currenciesChartData);

      // set data
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
      this.chartHoldings = this.getPieChartHoldings(
        this.currentPortfolio.portfolioFile
      );

      // voeg voor elke holding een kleur toe
      this.setColors(this.chartHoldings, this.holdingsChartData);

      // set data
      if (this.chartHoldings === false) {
        this.holdingsChartData.labels = [];
        this.holdingsChartData.datasets[0].data = [];

        this.chartErrorMsg = "You currently have no holdings.";
      } else {
        this.chartErrorMsg = null;
        this.holdingsChartData.labels = this.chartHoldings.labels;
        this.holdingsChartData.datasets[0].data = this.chartHoldings.data;
      }
    },
    setColors(holdings, holdingsData) {
      // sets as many colors as there are holdings
      const colors = [];

      for (let i = 0; i < holdings.data.length; i++) {
        let color = "#4a89ff";
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