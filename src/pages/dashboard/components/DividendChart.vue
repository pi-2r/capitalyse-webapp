<template>
  <section class="dividendChartContainer">
    <!-- time frame -->
    <section class="timeFrame" v-if="!hideTimeFrameBtns">
      <!-- radios -->
      <section class="timeFrame__buttons">
        <button
          @click="timeFrameChange"
          :class="{ btnActive: selectedTimeFrame == timeFrameOptions.allTime }"
          class="timeFrame__btn"
        >
          {{ timeFrameOptions.allTime }}
        </button>
        <button
          @click="timeFrameChange"
          :class="{
            btnActive: selectedTimeFrame == timeFrameOptions.yearToDate,
          }"
          class="timeFrame__btn"
        >
          {{ timeFrameOptions.yearToDate }}
        </button>
        <button
          @click="timeFrameChange"
          :class="{ btnActive: selectedTimeFrame == timeFrameOptions.oneYear }"
          class="timeFrame__btn"
        >
          {{ timeFrameOptions.oneYear }}
        </button>
        <button
          @click="timeFrameChange"
          :class="{
            btnActive: selectedTimeFrame == timeFrameOptions.threeYears,
          }"
          class="timeFrame__btn"
        >
          {{ timeFrameOptions.threeYears }}
        </button>
        <button
          @click="timeFrameChange"
          :class="{
            btnActive: selectedTimeFrame == timeFrameOptions.fiveYears,
          }"
          class="timeFrame__btn"
        >
          {{ timeFrameOptions.fiveYears }}
        </button>
      </section>
    </section>

    <Card class="dividendChartWrapper">
      <section class="dividendChartHeading">
        <h2>Dividends</h2>
        <transition name="slide-fade" mode="out-in">
          <p :key="selectedTimeFrame">
            <span class="chartResultValue"> €{{ totalDividends }} </span>
          </p>
        </transition>
      </section>

      <p class="chartErrorMsg" v-if="chartErrorMsg">
        {{ chartErrorMsg }}
      </p>
      <section class="dividendChart" v-else>
        <BarChart v-if="!isLoading" :chart-data="chartData" />
        <section class="spinnerContainer" v-else>
          <spinner />
        </section>
      </section>
    </Card>

    <!-- <section class="dividendChartBtns" v-if="!chartErrorMsg && !isLoading">
      <CardButtonArrow class="goToDividendsPageBtn">
        View Dividends
      </CardButtonArrow>
    </section> -->
  </section>
</template>

<script>
import BarChart from "@/components/ui/BarChart.vue";
import Card from "@/components/ui/Card.vue";
// import CardButtonArrow from "@/components/ui/CardButtonArrow.vue";

import getChartDividendsMixin from "@/mixins/analytics/getChartDividends";

export default {
  mixins: [getChartDividendsMixin],
  components: {
    BarChart,
    Card,
    // CardButtonArrow,
  },
  props: {
    hideTimeFrameBtns: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoading: true,
      selectedTimeFrame: "All Time",
      dividendsArray: [],
      chartErrorMsg: null,
      dataHolder: [],
      labelsHolder: [],
      timeFrameOptions: {
        allTime: "All Time",
        yearToDate: "YTD",
        oneYear: "1 Year",
        threeYears: "3 Years",
        fiveYears: "5 Years",
      },
      chartData: {
        labels: [],
        datasets: [],
      },
    };
  },
  computed: {
    currentPortfolio() {
      return this.$store.getters["files/getCurrentPortfolio"];
    },
    totalDividends() {
      let total = 0;
      for(let i = 0; i < this.dividendsArray.length; i++) {
        let dividendsList = this.dividendsArray[i].dividend;
        // add all the dividends together
        for(let j = 0; j < dividendsList.length; j++) {
          total += dividendsList[j].amount;
        }
      }
      return total.toFixed(2);
    },
    isThereData() {
      return !!this.currentPortfolio.accountFile;
    },
  },
  watch: {
    isThereData() {
      this.loadData();
    },
    $route() {
      this.loadData();
    },
  },
  methods: {
    setTheme() {
      // vraag thema op en verander de chart kleuren
      const theme = localStorage.getItem("theme");
      if (theme === "dark") {
        this.chartData.datasets[0].backgroundColor = "#007cda";
        this.chartData.datasets[0].borderColor = "#007cda";
      } else {
        this.chartData.datasets[0].backgroundColor = "#007cda";
        this.chartData.datasets[0].borderColor = "#007cda";
        this.chartData.datasets[0].hoverBorderColor = "#007cda";
      }
    },
    setColors(holdingsData) {
      // sets as many colors as there are holdings
      const colors = [
        "#205aab",
        "#1875c7",
        "#4083b5",
        "#4092b5",
        "#40a5b5",
        "#4069b5",
        "#40a7b5",
        "#6ea0c4",
      ];
      let holdingsList = [];
      for (let i = 0; i < holdingsData.datasets.length; i++) {
        // sum object
        const sum = holdingsData.datasets[i].data.reduce((a, b) => a + b, 0);
        const isin = holdingsData.datasets[i].isin;
        holdingsList.push({
          index: i,
          sum: sum,
          isin: isin,
        });
      }

      // sort holdingsList by sum
      holdingsList.sort((a, b) => b.sum - a.sum);

      for (let i = 0; i < holdingsList.length; i++) {
        holdingsData.datasets[holdingsList[i].index].backgroundColor =
          colors[i];
      }
    },
    loadData() {
      if (this.isThereData) {
        this.getDividends();
        this.isLoading = false;
      } else {
        this.isLoading = true;
      }
    },
    timeFrameChange(e) {
      // als er op een timeframe button wordt geklikt, geeft
      // die butten de event mee. van deze event wordt de text
      // vd button gelezen opgeslagen als huidige timeframe
      this.selectedTimeFrame = e.target.innerText;
      this.isThereData ? this.getDividends() : null;
      this.timeFrameDataUpdate();
    },
    getDividends() {
      this.dividendsArray = [];
      this.chartData.datasets = [];
      
      // haal dividends op van de Mixin
      const chartDividends = this.getChartDividends(
        this.currentPortfolio.accountFile
      );

      // als er geen dividends zijn, geef een error message
      // als er wel dividends zijn, maak een array aan met de labels en data
      if (chartDividends === false) {
        this.chartData.labels = [];
        this.chartData.datasets[0].data = [];

        this.chartErrorMsg = "No dividends received yet.";
      } else {
        this.chartErrorMsg = null;
        this.dividendsArray = chartDividends;
        this.chartData.labels = this.dividendsArray[0].datesList;

        // fill stacked chart
        for (let i = 0; i < chartDividends.length; i++) {
          this.chartData.datasets.push({
            label: chartDividends[i].name,
            isin: chartDividends[i].isin,
            backgroundColor: "#007cda",
            borderRadius: 4,
            borderWidth: 0,
            borderSkipped: "bottom",
            borderColor: "transparent",
            borderDash: [10, 5],
            barPercentage: "1",
            hoverBorderColor: "transparent",
            data: chartDividends[i].dividendsList,
          });
        }
      }

      // voeg voor elke holding een kleur toe
      this.setColors(this.chartData);
    },
    timeFrameDataUpdate() {
      // timeframes anders dan All-time
      // als geselecteerd wordt, verander de data in de chart
      if (this.selectedTimeFrame === this.timeFrameOptions.yearToDate) {
        this.setYearToDateData();
      } else if (this.selectedTimeFrame === this.timeFrameOptions.oneYear) {
        this.setYearDate(1);
      } else if (this.selectedTimeFrame === this.timeFrameOptions.threeYear) {
        this.setYearDate(3);
      } else if (this.selectedTimeFrame === this.timeFrameOptions.fiveYear) {
        this.setYearDate(5);
      }
    },
    setYearToDateData() {
      // Mixin
      this.setYearToDate();
    },
    setYearDate(years) {
      // Mixin
      this.setYears(years);
    },
  },
  created() {
    // laad data als deze al is gefetcht
    // zet het thema op de chart
    this.loadData();
  },
};
</script>

<style scoped>
.dividendChartHeadingContent {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}
.timeFrame {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dividendChartBtns {
  display: flex;
  width: 100%;
}
.goToDividendsPageBtn {
  margin-top: 0.5rem;
  width: 15rem;
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

.dividendChartWrapper {
  padding: 1.75rem;
  padding-bottom: 0rem;
  background-color: var(--clr-very-light-blue);
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow-big);
  border: 1px solid var(--clr-light-grey);
}

.dividendChartHeading {
  margin-bottom: 1.25rem;
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
  color: var(--clr-blue);
}

.timeFrame__buttons {
  margin-bottom: 0.5rem;
  display: flex;
}

.timeFrame__btn {
  padding: 0.4rem 0.6rem;
  font-weight: 600;
  font-size: 0.9rem;
  margin-right: 0.5rem;
  background-color: var(--clr-very-light-blue);
  color: var(--clr-grey);
  transform: translateY(0px);
  border: 1px solid var(--clr-light-grey);
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