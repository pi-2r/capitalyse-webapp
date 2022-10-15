<template>
  <HoldingsPieChartCard
    title="Holdings"
    btnText="My Holdings"
    :showBtn="false"
    chartErrorMsg="You currently have no holdings."
    :chartOptions="chartOptions"
    :chartData="holdingsChartData"
    :isLoading="isLoadingHoldings"
  />
  <HoldingsPieChartCard
    title="Currencies"
    btnText="My Holdings"
    :showBtn="false"
    chartErrorMsg="No currencies found."
    :chartOptions="chartOptions"
    :chartData="currenciesChartData"
    :isLoading="isLoadingCurrencies"
  />
</template>
<script>
import HoldingsPieChartCard from "./HoldingsPieChartCard";

export default {
  props: ['pieChartCurrencies', 'pieChartHoldings'],
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
                return Intl.NumberFormat('nl-nl', {style: 'currency', currency: 'EUR'}).format(value.parsed);
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
    isThereAnalyticsData() {
      return this.pieChartCurrencies != null && this.pieChartHoldings != null
    },
  },
  watch: {
    isThereAnalyticsData() {
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
          if(this.$route.params.id != null) {
            // default behaviour
            this.$router.push('/dashboard/' + this.$route.params.id + '/holdings/' + this.chartHoldings.isin[data[0].index]);
          } else if(this.$route.params.uid != null && this.$route.params.pid != null) {
            this.$router.push('/dashboard/shared/' + this.$route.params.uid + '/' + this.$route.params.pid + '/holdings/' + this.chartHoldings.isin[data[0].index])
          } else {
             // if is demo, because theres no id param on the demo route
            this.$router.push('/dashboard/demo/holdings/' + this.chartHoldings.isin[data[0].index]);
          }
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
      if (this.isThereAnalyticsData) {
        // bereken data voor de holdings pie chart en de currencies pie chart
        this.setCurrenciesData();
        this.isLoadingCurrencies = false
        this.setHoldingsData();
        this.isLoadingHoldings = false
      }
    },
    setCurrenciesData() {
      // currencies
      let chartCurrencies = this.pieChartCurrencies

      // voeg voor elke currency een kleur toe
      this.setColors(chartCurrencies, this.currenciesChartData);

      // set data
      if (chartCurrencies === false) {
        this.currenciesChartData.labels = [];
        this.currenciesChartData.datasets[0].data = [];

        this.chartErrorMsg = "No currencies found";
      } else {
        this.chartErrorMsg = null;
        this.currenciesChartData.labels = chartCurrencies.labels;
        this.currenciesChartData.datasets[0].data = chartCurrencies.data;
      }
    },
    setHoldingsData() {
      // holdings
      this.chartHoldings = this.pieChartHoldings

      // voeg voor elke holding een kleur toe
      this.setColors(this.chartHoldings, this.holdingsChartData);

      // set data
      if (this.chartHoldings === false) {
        this.holdingsChartData.labels = [];
        this.holdingsChartData.datasets[0].data = [];

        this.chartErrorMsg = "You currently have no holdings";
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
    if(this.isThereAnalyticsData) {
      this.loadData();
      this.setTheme();
    }
  },
};
</script>