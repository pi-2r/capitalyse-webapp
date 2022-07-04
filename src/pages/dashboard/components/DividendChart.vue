<template>
  <section class="dividendChartContainer">
    <!-- time frame -->
    <section class="timeFrame">
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
        <!-- <button class="timeFrame__btn" id="js--timeFrame__btn--pastThreeYears">3 Years</button>
                <button class="timeFrame__btn" id="js--timeFrame__btn--pastFiveYears">5 Years</button> -->
      </section>
    </section>

    <section class="dividendChartWrapper">
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
    </section>
  </section>
</template>

<script>
import BarChart from "@/components/ui/BarChart.vue";

import getChartDividendsMixin from "@/mixins/analytics/getChartDividends";
import cleanNumberMixin from "@/mixins/helpers/cleanNumber";
import includesFromArrayMixin from "@/mixins/helpers/includesFromArray";
import splitDateMixin from "@/mixins/helpers/splitDate";

export default {
  mixins: [
    getChartDividendsMixin,
    cleanNumberMixin,
    includesFromArrayMixin,
    splitDateMixin,
  ],
  components: {
    BarChart,
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
        datasets: [
          {
            label: "Dividends Received",
            backgroundColor: "#e1f1fb",
            borderWidth: 0,
            borderRadius: 5,
            borderSkipped: "bottom",
            borderColor: "#0091ff",
            hoverBorderWidth: 1,
            borderDash: [10,5],
            barPercentage: '0.7',
            hoverBorderColor: "#0091ff",
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
    totalDividends() {
      // bereken de totale dividenden van dit timeframe
      let total = 0;
      for (let i = 0; i < this.dividendsArray.length; i++) {
        total += this.dividendsArray[i].divAmt;
      }
      total = total.toFixed(2);
      total = parseFloat(total).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return total;
    },
    isThereData() {
      return !!this.currentPortfolio.accountFile;
    },
  },
  watch: {
    isThereData() {
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
        this.chartData.labels = chartDividends.labels;
        this.chartData.datasets[0].data = chartDividends.data;
      }
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
      this.updateChart();
    },
    setYearToDateData() {
      // Mixin
      this.setYearToDate();
    },
    setYearDate(years) {
      // Mixin
      this.setYears(years);
    },
    updateChart() {
      // zorg dat de holders de meest recente data tonen op de kaart
      this.chartData.labels = this.labelsHolder;
      this.chartData.datasets[0].data = this.dataHolder;
    },
  },
  created() {
    // laad data als deze al is gefetcht
    // zet het thema op de chart
    this.loadData();
    this.setTheme();
  },
};
</script>

<style scoped>
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