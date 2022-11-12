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
  :showTooltip="true"
  tooltipText="This is the diversification of your portfolio in sectors. Hover over the chart to see more details."
    title="Sectors"
    btnText="My Holdings"
    :showBtn="false"
    chartErrorMsg="No sectors found."
    :chartOptions="chartOptions"
    :chartData="sectorsChartData"
    :isLoading="isLoadingSectors"
  />
</template>
<script>
import HoldingsPieChartCard from "./HoldingsPieChartCard";

export default {
  props: ['pieChartSectors', 'pieChartHoldings'],
  components: {
    HoldingsPieChartCard,
  },
  data() {
    return {
      isLoadingHoldings: true,
      isLoadingSectors: true,
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
            borderWidth: 2,
            borderColor: "white",
            backgroundColor: [],
            data: [],
          },
        ],
      },
      sectorsChartData: {
        labels: [],
        datasets: [
          {
            borderWidth: 2,
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
      return this.pieChartSectors != null && this.pieChartHoldings != null
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
        this.sectorsChartData.datasets[0].borderColor = "rgb(45, 45, 45)";
        this.holdingsChartData.datasets[0].borderColor = "rgb(45, 45, 45)";
        this.chartOptions.plugins.tooltip.backgroundColor = 'rgb(52, 52, 52)';
      } else {
        this.sectorsChartData.datasets[0].borderColor = "white";
        this.holdingsChartData.datasets[0].borderColor = "white";
      }
    },
    loadData() {
      if (this.isThereAnalyticsData) {
        // bereken data voor de holdings pie chart en de sectors pie chart
        this.setSectorsData();
        this.isLoadingSectors = false
        this.setHoldingsData();
        this.isLoadingHoldings = false
      }
    },
    setSectorsData() {
      // sectors
      let chartSectors = this.pieChartSectors

      // voeg voor elke sector een kleur toe
      this.setColors(chartSectors, this.sectorsChartData);

      // set data
      if (chartSectors === false) {
        this.sectorsChartData.labels = [];
        this.sectorsChartData.datasets[0].data = [];

        this.chartErrorMsg = "No sectors found";
      } else {
        this.chartErrorMsg = null;
        this.sectorsChartData.labels = chartSectors.labels;
        this.sectorsChartData.datasets[0].data = chartSectors.data;
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
      const colors = [
        "#4a7aff",
        "#4a89ff",
        "#4a95ff",
        // "#4a5fff",
        "#4aa4ff",
        "#4ab7ff",
        "#4ac6ff",
        "#4ad5ff",
        "#4adbff",
        "#4af6ff",
        "#4afff0",
        "#4affe1",
        // "#4a4dff",
        // "#5c4aff",
        "#4affcc",
        "#4affb1",
        "#4aff89",
        "#77ff4a",
        "#4ac6ff",
        "#4ad5ff",
        "#4adbff",
        "#4af6ff",
        "#4afff0",
        "#4affe1",
        "#4a4dff",
        "#4a7aff",
        "#4a89ff",
        "#4a95ff",
        "#4a5fff",
        "#4aa4ff",
        "#4ab7ff",
      ];
      const amtofColors = colors.length

      for (let i = 0; i < holdings.data.length; i++) {
        let color = colors[Math.floor(Math.random() * amtofColors)];
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