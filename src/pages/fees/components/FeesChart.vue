<template>
  <section class="feesChartContainer">
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

    <Card class="feesChartWrapper">
      <section class="feesChartHeading">
        <h2>
          Fees <Tooltip v-if="showTooltip">{{ tooltipText }}</Tooltip>
        </h2>
        <transition name="slide-fade" mode="out-in">
          <p :key="selectedTimeFrame">
            <span class="chartResultValue"
              >{{
                Intl.NumberFormat("nl-nl", {
                  style: "currency",
                  currency: "EUR",
                }).format(totalFees)
              }}
            </span>
            <span class="chartAverageResultValue"
              >avg.
              {{
                Intl.NumberFormat("nl-nl", {
                  style: "currency",
                  currency: "EUR",
                }).format(averageFeesPerMonth)
              }}/mo</span
            >
          </p>
        </transition>
      </section>

      <p class="chartErrorMsg" v-if="chartErrorMsg">
        {{ chartErrorMsg }}
      </p>
      <section class="feesChart" v-else>
        <BarChart v-if="!isLoading" :chart-data="chartData" />
        <section class="spinnerContainer" v-else>
          <spinner />
        </section>
      </section>
      <section class="cardBtnSection" v-if="withBtn">
        <CardButtonArrow class="cardBtnArrow__feesChart" :to="toLink">
          View Fees
        </CardButtonArrow>
      </section>
    </Card>
  </section>
</template>

<script>
import BarChart from "@/components/ui/BarChart.vue";
import Card from "@/components/ui/Card.vue";
import CardButtonArrow from "@/components/ui/CardButtonArrow.vue";


export default {
  components: {
    BarChart,
    Card,
    CardButtonArrow,
  },
  props: {
    chartFeesProps: {
      required: true,
    },
    showTooltip: {
      default: false,
      type: Boolean,
    },
    tooltipText: {
      default: "No explanation yet.",
      type: String,
    },
    withBtn: {
      default: false,
      type: Boolean,
    },
    hideTimeFrameBtns: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      default: false,
      type: Boolean,
    }
  },
  data() {
    return {
      test: null,
      isLoading: true,
      selectedTimeFrame: "All Time",
      feesArray: [],
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
    toLink() {
      if(this.isPublic === true) {
        return `/shared/${this.$route.params.uid}/${this.$route.params.pid}/fees`
      } else {
        return `/dashboard/${this.$route.params.id}/fees`;
      }
    },
    totalFees() {
      let total = 0;
      for (let i = 0; i < this.feesArray.length; i++) {
        let feesList = this.feesArray[i].fees;
        // add all the fees together
        for (let j = 0; j < feesList.length; j++) {
          total += feesList[j].amount;
        }
      }
      return total;
    },
    averageFeesPerMonth() {
      // if theres fees
      if (this.feesArray.length > 0) {
        let total = 0;
        for (let i = 0; i < this.feesArray.length; i++) {
          let feesList = this.feesArray[i].fees;
          // add all the feess together
          for (let j = 0; j < feesList.length; j++) {
            total += feesList[j].amount;
          }
        }
        let average = (total / this.feesArray[0].datesList.length).toFixed(
          2
        );

        return average;
      } else {
        return 0;
      }
    },
    isThereData() {
      return this.chartFeesProps !== [];
    },
    // getFeesAnalytics() {
    //   const analytics = this.$store.getters["files/getAnalytics"];
    //   for (let i = 0; i < analytics.length; i++) {
    //     if (Object.keys(analytics[i]).includes(this.$route.params.id)) {
    //       return analytics[i][this.$route.params.id].feesAnalytics;
    //     }
    //   }
    //   return null;
    // },
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
        "#D03533",
        "#832120",
        "#631918",
        "#820A20",
        "#5D0D0C",
        "#6C0510",
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
        this.getFees();
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
        this.isThereData ? this.getFees() : null;
        this.timeFrameDataUpdate();
        this.isLoading = false;
      }, 1);
    },
    getFees() {
      this.feesArray = [];
      this.chartData.datasets = [];

      // haal fees op van de Mixin
      let chartFees = JSON.parse(JSON.stringify(this.chartFeesProps));
      // const chartFees = this.getChartFees(
      //   this.currentPortfolio.accountFile
      // );

      // als er geen fees zijn, geef een error message
      // als er wel fees zijn, maak een array aan met de labels en data
      if (chartFees === false) {
        this.chartData.labels = [];
        this.chartData.datasets.push({
          label: "",
          data: [],
          backgroundColor: "#007cda",
          borderColor: "#007cda",
          hoverBorderColor: "#007cda",
        });

        this.chartErrorMsg = "No fees found";
      } else {
        this.chartErrorMsg = null;
        this.feesArray = chartFees;
        this.chartData.labels = this.feesArray[0].datesList;

        // fill stacked chart
        for (let i = 0; i < this.feesArray.length; i++) {
          this.chartData.datasets.push({
            label: this.feesArray[i].name,
            isin: this.feesArray[i].isin,
            backgroundColor: "#007cda",
            borderRadius: 4,
            borderWidth: 0,
            borderSkipped: "bottom",
            borderColor: "transparent",
            borderDash: [10, 5],
            barPercentage: "1",
            hoverBorderColor: "transparent",
            data: this.feesArray[i].feesList,
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

      for (let i = 0; i < this.feesArray.length; i++) {
        for (let j = 0; j < this.feesArray[i].fees.length; j++) {
          let feeYear = parseFloat(
            this.feesArray[i].fees[j].date.split("-")[1]
          );

          if (feeYear < currentYear) {
            this.feesArray[i].fees.splice(j, 1);
            this.feesArray[i].datesList.splice(j, 1);
            this.feesArray[i].feesList.splice(j, 1);
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
      for (let i = 0; i < this.feesArray.length; i++) {
        for (let j = 0; j < this.feesArray[i].fees.length; j++) {
          let feeYear = this.feesArray[i].fees[j].date;
          let labelYear = parseFloat(feeYear.split("-")[1]);
          let labelMonth = parseFloat(feeYear.split("-")[0]);
          let labelDate = new Date(labelYear, labelMonth - 1);

          if (labelDate < yearAgo || labelDate < yearAgo + 1) {
            this.feesArray[i].fees.splice(j, 1);
            this.feesArray[i].datesList.splice(j, 1);
            this.feesArray[i].feesList.splice(j, 1);
            j--;
          }
        }
      }
    },
  },
  created() {
    // laad data als deze al is gefetcht
    // zet het thema op de chart
    if (this.isThereData) {
      this.loadData();
    }
  },
};
</script>

<style scoped>
.cardBtnArrow__feesChart {
  margin-top: 0;
  width: 18rem;
}

.cardBtnSection {
  display: flex;
  justify-content: center;
  padding: 1rem;
  padding-top: 0;
  margin-bottom: 0.5rem;
}

.cardBtnSection__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

.cardBtnSection__btnIcon {
  transition: 0.15s all;
}

.cardBtnSection__btn:hover .cardBtnSection__btnIcon {
  transform: scale(1.02) translateX(0.2rem);
}

.feesChartHeadingContent {
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
.feesChartBtns {
  display: flex;
  width: 100%;
}

.chartAverageResultValue {
  font-size: 0.8rem;
  display: block;
  font-weight: 500;
  color: var(--clr-red);
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

.feesChartWrapper {
  padding: 1.75rem;
  padding-bottom: 0rem;
  background-color: var(--clr-very-light-blue);
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow-big);
}

.feesChartHeading {
  margin-bottom: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.feesChartHeading p {
  text-align: right;
}

.feesChart {
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
  color: var(--clr-red);
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

@media screen and (max-width: 650px) {
  .cardBtnArrow__feesChart {
    width: 100%;
  }
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