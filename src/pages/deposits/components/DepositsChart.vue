<template>
  <section class="depositChartContainer">
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

    <Card class="depositChartWrapper">
      <section class="depositChartHeading">
        <h2>Deposits</h2>
        <transition name="slide-fade" mode="out-in">
          <p :key="selectedTimeFrame">
            <span class="chartResultValue"
              >{{
                Intl.NumberFormat("nl-nl", {
                  style: "currency",
                  currency: currency,
                }).format(totalDeposits)
              }}
            </span>
            <span class="chartAverageResultValue"
              >avg.
              {{
                Intl.NumberFormat("nl-nl", {
                  style: "currency",
                  currency: currency,
                }).format(averageDepositsPerMonth)
              }}/mo</span
            >
          </p>
        </transition>
      </section>

      <p class="chartErrorMsg" v-if="chartErrorMsg">
        {{ chartErrorMsg }}
      </p>
      <section class="depositChart" v-else>
        <LineChart v-if="!isLoading" :chart-data="chartData" :currency="currency" />
        <section class="spinnerContainer" v-else>
          <spinner />
        </section>
      </section>
    </Card>
  </section>
</template>
<script>
import LineChart from "@/components/ui/LineChart.vue";
import Card from "@/components/ui/Card.vue";

// import getChartDepositsMixin from "@/mixins/analytics/getChartDeposits";

export default {
  // mixins: [
  // getChartDepositsMixin,
  // ],
  props: {
    chartDepositsProps: {
      default: null,
      required: true,
    },
    currency: {
      default: 'EUR',
      required: false,
    }
  },
  components: {
    LineChart,
    Card,
  },
  data() {
    return {
      isLoading: true,
      selectedTimeFrame: "All Time",
      depositsArray: [],
      chartDeposits: null,
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
            data: [],
            fill: true,
            borderColor: "#0084ff",
            borderWidth: 2,
            cubicInterpolationMode: "monotone",
          },
        ],
      },
    };
  },
  computed: {
    indexes() {
      return this.$store.getters["indexes/deposits"];
    },
    depositNames() {
      return this.$store.getters["dictionary/deposit"];
    },
    failedDepositNames() {
      return this.$store.getters["dictionary/failedDeposit"];
    },
    withdrawalNames() {
      return this.$store.getters["dictionary/withdrawal"];
    },
    currentPortfolio() {
      return this.$store.getters["files/getCurrentPortfolio"];
    },
    totalDeposits() {
      if (this.chartDepositsProps != false) {
        const firstMonthIndex = this.chartDepositsProps.labels.indexOf(
          this.chartData.labels[0]
        );

        if (firstMonthIndex > 0) {
          return (
            this.chartData.datasets[0].data[
              this.chartData.datasets[0].data.length - 1
            ] - this.chartDepositsProps.data[firstMonthIndex - 1]
          );
        } else {
          return this.chartData.datasets[0].data[
            this.chartData.datasets[0].data.length - 1
          ];
        }
      }
      return 0;
    },
    averageDepositsPerMonth() {
      if (this.chartDepositsProps != false) {
        let total = this.totalDeposits;
        let average = total / this.chartData.labels.length;
        return average;
      }
      return 0;
    },
    isThereData() {
      return this.chartDepositsProps !== null;
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
      const theme = localStorage.getItem("theme");
      if (theme === "dark") {
        this.chartData.datasets[0].backgroundColor = "#223443";
        this.chartData.datasets[0].borderColor = "#0084ff";
      } else {
        this.chartData.datasets[0].backgroundColor = "#e1f1fb";
        this.chartData.datasets[0].borderColor = "#0091ff";
      }
    },
    loadData() {
      if (this.isThereData) {
        this.getDeposits();
        this.isLoading = false;
      } else {
        this.isLoading = true;
      }
    },
    timeFrameChange(e) {
      this.selectedTimeFrame = e.target.innerText;
      this.isThereData ? this.getDeposits() : null;
      this.timeFrameDataUpdate();
    },
    getDeposits() {
      if (this.chartDepositsProps === false) {
        this.chartData.labels = [];
        this.chartData.datasets[0].data = [];

        this.chartErrorMsg =
          "No results";
      } else {
        this.chartData.labels = JSON.parse(
          JSON.stringify(this.chartDepositsProps.labels)
        );
        this.chartData.datasets[0].data = JSON.parse(
          JSON.stringify(this.chartDepositsProps.data)
        );
        this.chartErrorMsg = null;
      }
    },
    addMissingMonthsToChart() {},
    timeFrameDataUpdate() {
      // timeframes other than All-time
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
      for (let i = 0; i < this.chartData.labels.length; i++) {
        let label = this.chartData.labels[i];
        let labelYear = label.split("-")[1];
        if (labelYear < currentYear) {
          this.chartData.labels.splice(i, 1);
          this.chartData.datasets[0].data.splice(i, 1);
          i--;
        }
      }
    },
    setYears(years) {
      // get one year ago in MM-YYYY
      let currentYear = new Date().getFullYear();
      let currentMonth = new Date().getMonth() + 1;
      let yearAgo = new Date(currentYear - years, currentMonth);

      // delete all months before yearAgo
      for (let i = 0; i < this.chartData.labels.length; i++) {
        let label = this.chartData.labels[i];
        let labelYear = label.split("-")[1];
        let labelMonth = label.split("-")[0];
        let labelDate = new Date(labelYear, labelMonth - 1);

        if (labelDate < yearAgo || labelDate < yearAgo + 1) {
          this.chartData.labels.splice(i, 1);
          this.chartData.datasets[0].data.splice(i, 1);
          i--;
        }
      }
    },
  },
  created() {
    this.loadData();
    this.setTheme();
  },
};
</script>

<style scoped>
h2 {
  color: var(--clr-grey);
}

.chartDataTypeStyling {
  color: var(--clr-grey);
  font-weight: 300;
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

.depositChartWrapper {
  padding: 1.75rem;
  padding-bottom: 0rem;
}

.depositChartContainer {
  margin-bottom: 3rem;
}

.depositChartHeading {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.depositChartHeading p {
  text-align: right;
}

.depositChart {
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
.chartAverageResultValue {
  font-size: 0.8rem;
  display: block;
  font-weight: 500;
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