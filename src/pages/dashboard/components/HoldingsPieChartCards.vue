<template>
  <Card class="pieChartsContainer">
    <section class="pieCharts">
      <HoldingsPieChartCard
        :title="holdingsName"
        btnText="My Holdings"
        :showBtn="false"
        chartErrorMsg="You currently have no holdings."
        :chartOptions="chartOptions"
        :chartData="holdingsChartData"
        :isLoading="isLoadingHoldings"
      />

      <HoldingsPieChartCard
        :showTooltip="true"
        tooltipText="This is the diversification of your portfolio in sectors."
        :title="sectorsName"
        btnText="My Holdings"
        :showBtn="false"
        chartErrorMsg="No sectors found."
        :chartOptions="chartOptions"
        :chartData="sectorsChartData"
        :isLoading="isLoadingSectors"
      />
      <HoldingsPieChartCard
        :showTooltip="true"
        tooltipText="This is the diversification of your portfolio in industries."
        :title="industriesName"
        btnText="My Holdings"
        :showBtn="false"
        chartErrorMsg="No industries found."
        :chartOptions="chartOptions"
        :chartData="industriesChartData"
        :isLoading="isLoadingIndustries"
      />
    </section>

    <section class="holdingsPieChart__btnSection">
      <CardButtonArrow class="holdingsPieChart__btn" :to="toLink"
        >View diversification</CardButtonArrow
      >
    </section>
  </Card>
</template>
<script>
import HoldingsPieChartCard from "./HoldingsPieChartCard";
import CardButtonArrow from "@/components/ui/CardButtonArrow.vue";

export default {
  props: ["pieChartSectors", "pieChartHoldings", "pieChartIndustries", "isPublic"],
  components: {
    HoldingsPieChartCard,
    CardButtonArrow,
  },
  data() {
    return {
      isLoadingHoldings: true,
      isLoadingIndustries: true,
      isLoadingSectors: true,
      chartHoldings: null,
      chartOptions: {
        maintainAspectRatio: true,
        layout: {
          padding: 35,
        },
        cutout: 70,
        hoverOffset: 5,
        hoverBorderColor: "transparent",
        // onClick: this.pieChartClickEvent,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            caretPadding: 6,
            usePointStyle: true,
            cornerRadius: 10,
            displayColors: false,
            titleFont: { size: 13 },
            titleColor: "#bdbdbd",
            bodyFont: { size: 12, color: "#0084ff" },
            bodyColor: "grey",
            backgroundColor: "rgb(260, 260, 260)",
            borderColor: "rgb(220, 220, 220)",
            borderWidth: 1,
            padding: 12,
            enabled: true,
            callbacks: {
              title: function (value) {
                return `${value[0].label}`;
              },
              label: function (value) {
                return Intl.NumberFormat("nl-nl", {
                  style: "currency",
                  currency: "EUR",
                }).format(value.parsed);
              },
            },
          },
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
      industriesChartData: {
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
      return this.pieChartSectors != null && this.pieChartHoldings != null;
    },
    toLink() {
      console.log(this.$route.params, this.isPublic);
      if (this.isPublic === true) {
        return `/shared/${this.$route.params.uid}/${this.$route.params.pid}/diversification`;
      } else {
        return `/dashboard/${this.$route.params.id}/diversification`;
      }
    },
    sectorsName() {
      if(this.sectorsChartData.datasets[0].data.length === 1) {
        return 'Sector'
      } else {
        return 'Sectors'
      }
    },
    holdingsName() {
      if(this.holdingsChartData.datasets[0].data.length === 1) {
        return 'Holding'
      } else {
        return 'Holdings'
      }
    },
    industriesName() {
      if(this.industriesChartData.datasets[0].data.length === 1) {
        return 'Industry'
      } else {
        return 'Industries'
      }
    },
  },
  watch: {
    isThereAnalyticsData() {
      this.loadData();
    },
    $route() {
      this.loadData();
    },
  },
  methods: {
    pieChartClickEvent(event, data) {
      // check of niet buiten de chart klikt
      if (data.length > 0) {
        console.log(event, data);
        if (event.chart.tooltip.title[0].length !== 3) {
          if (this.$route.params.id != null) {
            // default behaviour
            this.$router.push(
              "/dashboard/" +
                this.$route.params.id +
                "/holdings/" +
                this.chartHoldings.isin[data[0].index]
            );
          } else if (
            this.$route.params.uid != null &&
            this.$route.params.pid != null
          ) {
            this.$router.push(
              "/dashboard/shared/" +
                this.$route.params.uid +
                "/" +
                this.$route.params.pid +
                "/holdings/" +
                this.chartHoldings.isin[data[0].index]
            );
          } else {
            // if is demo, because theres no id param on the demo route
            this.$router.push(
              "/dashboard/demo/holdings/" +
                this.chartHoldings.isin[data[0].index]
            );
          }
        }
      }
    },
    setTheme() {
      const theme = localStorage.getItem("theme");
      if (theme === "dark") {
        this.sectorsChartData.datasets[0].borderColor = "rgb(45, 45, 45)";
        this.holdingsChartData.datasets[0].borderColor = "rgb(45, 45, 45)";
        this.industriesChartData.datasets[0].borderColor = "rgb(45, 45, 45)";
        this.chartOptions.plugins.tooltip.backgroundColor = "rgb(52, 52, 52)";
      } else {
        this.sectorsChartData.datasets[0].borderColor = "white";
        this.industriesChartData.datasets[0].borderColor = "white";
        this.holdingsChartData.datasets[0].borderColor = "white";
      }
    },
    loadData() {
      if (this.isThereAnalyticsData) {
        // bereken data voor de holdings pie chart en de sectors pie chart
        this.setSectorsData();
        this.isLoadingSectors = false;
        this.setHoldingsData();
        this.isLoadingHoldings = false;
        this.setIndustriesData();
        this.isLoadingIndustries = false;
      }
    },
    setSectorsData() {
      // sectors
      let chartSectors = this.pieChartSectors;

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
      this.chartHoldings = this.pieChartHoldings;

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
    setIndustriesData() {
      // sectors
      let chartIndustries = this.pieChartIndustries;

      // voeg voor elke sector een kleur toe
      this.setColors(chartIndustries, this.industriesChartData);

      // set data
      if (chartIndustries === false) {
        this.industriesChartData.labels = [];
        this.industriesChartData.datasets[0].data = [];

        this.chartErrorMsg = "No sectors found";
      } else {
        this.chartErrorMsg = null;
        this.industriesChartData.labels = chartIndustries.labels;
        this.industriesChartData.datasets[0].data = chartIndustries.data;
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
      const amtofColors = colors.length;

      for (let i = 0; i < holdings.data.length; i++) {
        let color = colors[Math.floor(Math.random() * amtofColors)];
        colors.push(color);
      }
      holdingsData.datasets[0].backgroundColor = colors;
    },
  },
  created() {
    if (this.isThereAnalyticsData) {
      this.loadData();
      this.setTheme();
    }
  },
};
</script>

<style scoped>
.pieChartsContainer {
  padding: 1rem;
  max-width: 100%;

  padding-bottom: 1rem;
}
.holdingsPieChart__btnSection {
  display: flex;
  justify-content: center;
}
.holdingsPieChart__btn {
  margin-top: 1rem;
  width: 20rem;
}

.pieCharts {
  display: grid;

  grid-template-columns: 1fr 1fr 1fr;
}

@media screen and (max-width: 1100px) {
  .pieChartsContainer {
    overflow: scroll;
  }
}
</style>