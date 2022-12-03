<template>
  <Card class="wrapper">
    <section class="divCard">
    <section class="divCard__chartSection">
      <section class="holdingsPieChartTitle">
        <h2>
          {{ title }}
          <Tooltip v-if="showTooltip">{{ tooltipText }}</Tooltip>
        </h2>
      </section>
      <section class="holdingsPieChart" v-if="!isLoading">
        <p v-if="chartErrorMsg" class="chartErrorMsg">{{ chartErrorMsg }}</p>

        <Doughnut
          v-else
          class="pieChart"
          :chartData="diversificationChartData"
          :chartOptions="chartOptions"
        />
      </section>
    </section>
    <section class="divCard__listSection">
      <section class="listSectionWrapper">
        <section
          :key="item"
          v-for="(item, index) in diversificationChartData.labels"
          class="listSection__item"
        >
          <DiversificationListItem
            :name="item"
            :index="index"
            :amount="diversificationChartData.datasets[0].data[index]"
            :labels="diversificationChartData.labels"
            :dataset="diversificationChartData"
          />
        </section>
      </section>
    </section>
    <section class="disclaimer">
      {{disclaimer}}
    </section>
    </section>
     <section class="holdingsPieChart__btnSection" v-if="showBtn">
      <CardButtonArrow class="holdingsPieChart__btn" :to="toLink"
        >View Diversification</CardButtonArrow
      >
    </section>
  </Card>
  
</template>
<script>
import CardButtonArrow from "@/components/ui/CardButtonArrow.vue";
import DiversificationListItem from "./DiversificationListItem.vue";
import { Doughnut } from "vue-chartjs";
import { Chart, ArcElement } from "chart.js";
Chart.register(ArcElement);

export default {
  data() {
    return {
      dynamicWidth: 30,
      windowWidth: null,
      isLoading: false,
      diversificationChartData: {
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
      chartOptions: {
        maintainAspectRatio: true,
        layout: {
          padding: 35,
        },
        cutout: 60,
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
    };
  },
  mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth;
    };
  },
  props: {
    disclaimer: {
      default: '',
      type: String,
    },
    showTooltip: {
      default: false,
      type: Boolean,
    },
    tooltipText: {
      default: '',
      type: String,
    },
    title: {
      default: "",
      type: String,
    },
    pieChartData: {
      default: [],
    },
    isPublic: {
      default: false,
    },
    showBtn: {
      default: false,
    },
  },
  components: {
    Doughnut,
    DiversificationListItem,
    CardButtonArrow,
  },
  computed: {
    isThereAnalyticsData() {
      return this.pieChartData != null;
    },
     toLink() {
      if (this.isPublic === true) {
        return `/shared/${this.$route.params.uid}/${this.$route.params.pid}/diversification`;
      } else {
        return `/dashboard/${this.$route.params.id}/diversification`;
      }
    },
  },
  methods: {
    setDynamicWidth() {},
    setDiversificationData() {
      // sectors
      let chartDiversification = this.pieChartData;

      // voeg voor elke sector een kleur toe
      this.setColors(chartDiversification, this.diversificationChartData);

      // set data
      if (chartDiversification === false) {
        this.diversificationChartData.labels = [];
        this.diversificationChartData.datasets[0].data = [];

        this.chartErrorMsg = "No sectors found";
      } else {
        this.chartErrorMsg = null;
        this.diversificationChartData.labels = chartDiversification.labels;
        this.diversificationChartData.datasets[0].data =
          chartDiversification.data;
      }
    },
    loadData() {
      if (this.isThereAnalyticsData) {
        // bereken data voor de holdings pie chart en de sectors pie chart
        this.setDiversificationData();
        this.isLoading = false;
      }
    },
    setTheme() {
      const theme = localStorage.getItem("theme");
      if (theme === "dark") {
        this.diversificationChartData.datasets[0].borderColor = "rgb(45, 45, 45)";
        this.chartOptions.plugins.tooltip.backgroundColor = "rgb(52, 52, 52)";
      } else {
        this.diversificationChartData.datasets[0].borderColor = "white";
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
  watch: {
    isThereAnalyticsData() {
      this.loadData();
    },
    $route() {
      this.loadData();
    },
    windowWidth() {
      if(this.windowWidth < 900) {
        this.chartOptions.cutout = '100'
      }
      if(this.windowWidth < 550) {
        this.chartOptions.cutout = '50'
      }
      if(this.windowWidth < 400) {
        this.chartOptions.cutout = '30'
      }
    }
  },
  created() {
    if(this.isThereAnalyticsData) {

      this.windowWidth = window.innerWidth
    this.setDiversificationData();
    this.setTheme()
    }
  },
};
</script>
<style scoped>
.wrapper {
  margin-bottom: 3rem;
}
.holdingsPieChart__btnSection {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}
.holdingsPieChart__btn {
  margin-top: 0 !important;
  width: 20rem;
}
.divCard__chartSection {
  min-width: 24rem;
}
.listSection__list {
  display: grid;
  grid-template-columns: 1fr;
}
.listSection__item {
  font-size: 0.9rem;
  padding: 0.5rem;
  padding-right: 1rem;
  margin-bottom: 0.5rem;
}
.divCard__listSection {
  overflow: scroll;
  max-height: 22rem;
  margin: 2rem;
  margin-bottom: 0;
  margin-left: 0;
}
.holdingsPieChart {
  display: flex;
  align-items: center;
  justify-content: center;
}
.divCard {
  position: relative;
  max-height: 34rem;
  padding: 1rem;
  display: grid;
  grid-template-columns: 46fr 54fr;
  gap: 1rem;
}
.disclaimer {
  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
  right: 0.75rem;
  text-align: center;
  color: var(--clr-light-grey);
  font-size: 0.7rem;
}
.pieChart {
  width: 70%;
}
h2 {
  text-align: center;
  padding-top: 2rem;
  font-size: 1.25rem;
}

@media screen and (max-width: 900px) {
  .divCard {
    grid-template-columns: 1fr;
    max-height: 100%;
  }
  .pieChart {
    transform: scale(1);
  }
  .divCard__listSection {
    padding-bottom: 0;
    margin-right: 0;
    padding-right: 0;
  }
  .divCard__chartSection {
    overflow: scroll;
  }
  .divCard__chartSection {
  min-width: 0rem;
}
}
</style>