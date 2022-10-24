
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
            <span class="chartResultValue">{{ Intl.NumberFormat('nl-nl', {style: 'currency', currency: 'EUR'}).format(totalDividends) }} </span>
            <span class="chartAverageResultValue"
              >avg. {{ Intl.NumberFormat('nl-nl', {style: 'currency', currency: 'EUR'}).format(averageDividendsPerMonth) }}/mo</span
            >
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

export default {
  components: {
    BarChart,
    Card,
    // CardButtonArrow,
  },
  props: {
    chartDividendsProps: {
      required: true,
    },
    hideTimeFrameBtns: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      test: null,
      isLoading: true,
      selectedTimeFrame: "All Time",
      dividendsArray: [],
      chartErrorMsg: null,
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
    totalDividends() {
      let total = 0;
      for (let i = 0; i < this.dividendsArray.length; i++) {
        let dividendsList = this.dividendsArray[i].dividend;
        // add all the dividends together
        for (let j = 0; j < dividendsList.length; j++) {
          total += dividendsList[j].amount;
        }
      }
      return total;
    },
    averageDividendsPerMonth() {
      // if theres dividends
      if (this.dividendsArray.length > 0) {
        let total = 0;
        for (let i = 0; i < this.dividendsArray.length; i++) {
          let dividendsList = this.dividendsArray[i].dividend;
          // add all the dividends together
          for (let j = 0; j < dividendsList.length; j++) {
            total += dividendsList[j].amount;
          }
        }
        let average = (total / this.dividendsArray[0].datesList.length).toFixed(
          2
        );
       
        return average;
      } else {
        return 0;
      }
    },
    isThereData() {
      return this.chartDividendsProps !== null;
    },
    gethomeAnalytics() {
      const analytics = this.$store.getters["files/getAnalytics"];
      for (let i = 0; i < analytics.length; i++) {
        if (Object.keys(analytics[i]).includes(this.$route.params.id)) {
          return analytics[i][this.$route.params.id].homeAnalytics;
        }
      }
      return null;
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
        "#4a7aff",
        "#4a89ff",
        "#4a95ff",
        "#4a5fff",
        "#4aa4ff",
        "#4ab7ff",
        "#4ac6ff",
        "#4ad5ff",
        "#4adbff",
        "#4af6ff",
        "#4afff0",
        "#4affe1",
        "#4a4dff",
        "#5c4aff",
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
      this.isLoading = true;
      setTimeout(() => {
        this.selectedTimeFrame = e.target.innerText;
        this.isThereData ? this.getDividends() : null;
        this.timeFrameDataUpdate();
        this.isLoading = false;
      }, 1);
    },
    getDividends() {
      this.dividendsArray = [];
      this.chartData.datasets = [];

      // haal dividends op van de Mixin
      let chartDividends = JSON.parse(JSON.stringify(this.chartDividendsProps))
      // const chartDividends = this.getChartDividends(
      //   this.currentPortfolio.accountFile
      // );

      // als er geen dividends zijn, geef een error message
      // als er wel dividends zijn, maak een array aan met de labels en data
      if (chartDividends === false) {
        this.chartData.labels = [];
        this.chartData.datasets.push({
          label: "",
          data: [],
          backgroundColor: "#007cda",
          borderColor: "#007cda",
          hoverBorderColor: "#007cda",
        });

        this.chartErrorMsg = "No dividends found";
      } else {
        this.chartErrorMsg = null;
        this.dividendsArray = chartDividends;
        this.chartData.labels = this.dividendsArray[0].datesList;

        // fill stacked chart
        for (let i = 0; i < this.dividendsArray.length; i++) {
          this.chartData.datasets.push({
            label: this.dividendsArray[i].name,
            isin: this.dividendsArray[i].isin,
            backgroundColor: "#007cda",
            borderRadius: 4,
            borderWidth: 0,
            borderSkipped: "bottom",
            borderColor: "transparent",
            borderDash: [10, 5],
            barPercentage: "1",
            hoverBorderColor: "transparent",
            data: this.dividendsArray[i].dividendsList,
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
        this.setYearToDate();
      } else if (this.selectedTimeFrame === this.timeFrameOptions.oneYear) {
        this.setYears(1);
      } else if (this.selectedTimeFrame === this.timeFrameOptions.threeYears) {
        this.setYears(3);
      } else if (this.selectedTimeFrame === this.timeFrameOptions.fiveYears) {
        this.setYears(5);
      }
    },
    setYearToDate() {
      // delete all months before this year
      let currentYear = new Date().getFullYear();

      for (let i = 0; i < this.dividendsArray.length; i++) {
        for (let j = 0; j < this.dividendsArray[i].dividend.length; j++) {
          let dividendYear = parseFloat(this.dividendsArray[i].dividend[j].date.split("-")[1]);

          if (dividendYear < currentYear) {
            this.dividendsArray[i].dividend.splice(j, 1);
            this.dividendsArray[i].datesList.splice(j, 1);
            this.dividendsArray[i].dividendsList.splice(j, 1);
            j--;
          }

        }
      }
    },
    setYears(years) {
      // get one year ago in MM-YYYY
      let currentYear = new Date().getFullYear();
      let currentMonth = new Date().getMonth() + 1;
      let yearAgo = new Date(currentYear - years, currentMonth);

      // delete all months before yearAgo
      for (let i = 0; i < this.dividendsArray.length; i++) {
        for (let j = 0; j < this.dividendsArray[i].dividend.length; j++) {
          let dividendYear = this.dividendsArray[i].dividend[j].date;
          let labelYear = parseFloat(dividendYear.split("-")[1]);
          let labelMonth = parseFloat(dividendYear.split("-")[0]);
          let labelDate = new Date(labelYear, labelMonth - 1);

          if (labelDate < yearAgo || labelDate < yearAgo + 1) {
            this.dividendsArray[i].dividend.splice(j, 1);
            this.dividendsArray[i].datesList.splice(j, 1);
            this.dividendsArray[i].dividendsList.splice(j, 1);
            j--;
          }
        }
      }
    }
  },
  created() {
    // laad data als deze al is gefetcht
    // zet het thema op de chart
    if(this.isThereData) {
      this.loadData();
    }
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

.chartAverageResultValue {
  font-size: 0.8rem;
  display: block;
  font-weight: 500;
  color: var(--clr-blue);
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