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
        <h2>Dividend Payments</h2>
        <transition name="slide-fade" mode="out-in">
          <p :key="selectedTimeFrame">
            <span class="chartResultValue greenNumber">
              €{{ (totalExchangeFees + totalTransactionFees).toFixed(2) }}
            </span>
          </p>
        </transition>
      </section>

      <p class="chartErrorMsg" v-if="chartErrorMsg">
        {{ chartErrorMsg }}
      </p>
      <section class="dividendChart" v-else>
        <StackedBarChart v-if="!isLoading" :chart-data="chartData" />
        <section class="spinnerContainer" v-else>
          <spinner />
        </section>
      </section>
    </section>
  </section>
</template>

<script>
import StackedBarChart from "@/components/ui/StackedBarChart.vue";

import cleanNumberMixin from "@/mixins/helpers/cleanNumber";
import includesFromArrayMixin from "@/mixins/helpers/includesFromArray";
import splitDateMixin from "@/mixins/helpers/splitDate";

export default {
  mixins: [cleanNumberMixin, includesFromArrayMixin, splitDateMixin],
  components: {
    StackedBarChart,
  },
  data() {
    return {
      isLoading: true,
      selectedTimeFrame: "All Time",
      exFeesArray: [],
      transFeesArray: [],
      totalExchangeFees: 0,
      totalTransactionFees: 0,
      chartErrorMsg: null,
      dataHolder: [],
      dataHolderTransFees: [],
      labelsHolder: [],
      labelsHolderTransLabels: [],
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
            label: "Fees",
            backgroundColor: "#e1f1fb",
            borderWidth: 0,
            borderRadius: 5,
            borderSkipped: "bottom",
            borderColor: "#0091ff",
            barPercentage: '0.7',
            hoverBorderWidth: 1,
            hoverBorderColor: "#0091ff",
            data: [],
          },
          {
            data: [],
          },
        ],
      },
    };
  },
  computed: {
    exchangeFeesIndexes() {
      return this.$store.getters["indexes/exchangeFees"];
    },
    exchangeFeesNames() {
      return this.$store.getters["dictionary/exchangeFees"];
    },
    transactionsFeesIndexes() {
      return this.$store.getters["indexes/transactions"];
    },
    transactionsFeesNames() {
      return this.$store.getters["dictionary/transactions"];
    },
    dividendNamesEUR() {
      return this.$store.getters["dictionary/dividendEUR"];
    },
    currencyNames() {
      return this.$store.getters["dictionary/currency"];
    },
    currentPortfolio() {
      return this.$store.getters["files/getCurrentPortfolio"];
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
      const theme = localStorage.getItem("theme");
      if (theme === "dark") {
        this.chartData.datasets[0].backgroundColor = "#223443";
        this.chartData.datasets[0].borderColor = "#0084ff";
      } else {
        this.chartData.datasets[0].backgroundColor = "#0091ff30";
        this.chartData.datasets[0].borderColor = "#0091ff";
        this.chartData.datasets[0].hoverBorderColor = "#0091ff";
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
      this.selectedTimeFrame = e.target.innerText;
      this.isThereData ? this.getDividends() : null;
      this.timeFrameDataUpdate();
    },
    getDividends() {
      const accountData = this.currentPortfolio.accountFile;
      const transactionsData = this.currentPortfolio.transactionsFile;

      const exFeesSearchIndex = this.exchangeFeesIndexes.searchIndex;
      const exFeesFeeIndex = this.exchangeFeesIndexes.feeIndex;
      const exFeesDateIndex = this.exchangeFeesIndexes.dateIndex;
      const exFeesNames = this.exchangeFeesNames;

      const transFeesDateIndex = this.transactionsFeesIndexes.dateIndex;
      const transFeesFeeIndex = this.transactionsFeesIndexes.searchIndex;

      // let totalTransactionFees = 0;

      this.exFeesArray = [];
      this.transFeesArray = [];
      this.labelsHolder = [];
      this.dataHolder = [];
      this.totalExchangeFees = 0;
      this.totalTransactionFees = 0;

      // get the exchange fees from account file
      for (let i = 0; i < accountData.length - 1; i++) {
        if (
          this.includesFromArray(exFeesNames, accountData[i][exFeesSearchIndex])
        ) {
          let alreadyExists = false;

          let feeDate = accountData[i][exFeesDateIndex].slice(3, 10);
          let feeAmount = this.cleanNumber(accountData[i][exFeesFeeIndex]) * -1;
          this.totalExchangeFees += feeAmount;

          if (this.exFeesArray.length === 0) {
            this.exFeesArray.push({
              date: feeDate,
              feeAmt: feeAmount,
            });
          } else {
            for (let j = 0; j < this.exFeesArray.length; j++) {
              if (this.exFeesArray[j].date === feeDate) {
                this.exFeesArray[j].feeAmt += feeAmount;
                alreadyExists = true;
                break;
              }
            }
            if (!alreadyExists) {
              this.exFeesArray.push({
                date: feeDate,
                feeAmt: feeAmount,
              });
            }
          }
        }
      }
      // get transaction fees from transactions file
      for (let i = 0; i < transactionsData.length - 1; i++) {
        if (transactionsData[i][transFeesFeeIndex] !== "") {
          let alreadyExists = false;

          let feeDate = transactionsData[i][transFeesDateIndex].slice(3, 10);
          let feeAmount =
            parseFloat(transactionsData[i][transFeesFeeIndex]) * -1;
          this.totalTransactionFees += feeAmount;

          if (this.transFeesArray.length === 0) {
            this.transFeesArray.push({
              date: feeDate,
              feeAmt: feeAmount,
            });
          } else {
            for (let j = 0; j < this.transFeesArray.length; j++) {
              if (this.transFeesArray[j].date === feeDate) {
                this.transFeesArray[j].feeAmt += feeAmount;
                alreadyExists = true;
                break;
              }
            }
            if (!alreadyExists) {
              this.transFeesArray.push({
                date: feeDate,
                feeAmt: feeAmount,
              });
            }
          }
        }
      }
      console.log(this.transFeesArray);

      if (this.exFeesArray.length > 0) {
        this.exFeesArray.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });

        let firstDate = this.exFeesArray[0].date.split("-");
        let lastDate =
          this.exFeesArray[this.exFeesArray.length - 1].date.split("-");
        let newFirstDate = new Date(lastDate[1], lastDate[0] - 1);
        let newLastDate = new Date(firstDate[1], firstDate[0]);

        let dateArray = [];
        while (newFirstDate < newLastDate) {
          dateArray.push(newFirstDate.toLocaleDateString());
          newFirstDate.setMonth(newFirstDate.getMonth() + 1);
        }

        this.exFeesArray.reverse();

        for (let i = 0; i < dateArray.length; i++) {
          let date = dateArray[i];
          let found = false;

          // find date in dividendsArray, if found add to chart
          for (let x = 0; x < this.exFeesArray.length; x++) {
            let dateFromArray = this.splitDate(this.exFeesArray[x].date);
            let newDateFromArray = new Date(
              dateFromArray[1],
              dateFromArray[0] - 1
            ).toLocaleDateString();

            if (date === newDateFromArray) {
              found = true;
              let fee = this.exFeesArray[x].feeAmt;
              this.dataHolder.push(fee);
            }
          }

          if (!found) {
            this.dataHolder.push(null);
          }

          date = this.splitDate(date);

          // if american notation
          if (
            this.splitDate(dateArray[1])[0] !== this.splitDate(dateArray[0])[0]
          ) {
            date = date[0] + "-" + date[2];
          } else {
            // if normal notation
            date = date[1] + "-" + date[2];
          }

          this.labelsHolder.push(date);
        }

        this.addMissingMonthsToChart();

        console.log(this.dataHolder);

        this.chartData.labels = this.labelsHolder;
        this.chartData.datasets[0].data = this.dataHolder;
      }

      if (this.transFeesArray.length > 0) {
        this.transFeesArray.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });

        let firstDate = this.transFeesArray[0].date.split("-");
        let lastDate =
          this.transFeesArray[this.transFeesArray.length - 1].date.split("-");
        let newFirstDate = new Date(lastDate[1], lastDate[0] - 1);
        let newLastDate = new Date(firstDate[1], firstDate[0]);

        let dateArray = [];
        while (newFirstDate < newLastDate) {
          dateArray.push(newFirstDate.toLocaleDateString());
          newFirstDate.setMonth(newFirstDate.getMonth() + 1);
        }

        this.transFeesArray.reverse();

        for (let i = 0; i < dateArray.length; i++) {
          let date = dateArray[i];
          let found = false;

          // find date in dividendsArray, if found add to chart
          for (let x = 0; x < this.transFeesArray.length; x++) {
            let dateFromArray = this.splitDate(this.transFeesArray[x].date);
            let newDateFromArray = new Date(
              dateFromArray[1],
              dateFromArray[0] - 1
            ).toLocaleDateString();

            if (date === newDateFromArray) {
              found = true;
              let fee = this.transFeesArray[x].feeAmt;
              this.dataHolderTransFees.push(fee);
            }
          }

          if (!found) {
            this.dataHolderTransFees.push(null);
          }

          date = this.splitDate(date);

          // if american notation
          if (
            this.splitDate(dateArray[1])[0] !== this.splitDate(dateArray[0])[0]
          ) {
            date = date[0] + "-" + date[2];
          } else {
            // if normal notation
            date = date[1] + "-" + date[2];
          }

          this.labelsHolderTransLabels.push(date);
        }

        this.addMissingMonthsToChart();

        this.chartData.labels = this.labelsHolderTransLabels;
        this.chartData.datasets[1].data = this.dataHolderTransFees;
      }
    },
    addMissingMonthsToChart() {
      // add potentially missing months untill current month

      let currentMonth =
        new Date().getMonth() + 1 + "-" + new Date().getFullYear();
      if (!this.includesFromArray(this.labelsHolder, currentMonth)) {
        let lastMonthInChart = this.labelsHolder[this.labelsHolder.length - 1];
        let lastMonth = this.splitDate(lastMonthInChart);
        let newLastMonth = new Date(lastMonth[1], lastMonth[0]);
        let newCurrentMonth = new Date(
          currentMonth.split("-")[1],
          currentMonth.split("-")[0] - 1
        );
        let firstiteration = true;

        while (newLastMonth <= newCurrentMonth) {
          firstiteration
            ? (newLastMonth = new Date(
                newLastMonth.getFullYear(),
                newLastMonth.getMonth() + 1
              ))
            : null;
          firstiteration = false;

          let pushedMonth = newLastMonth.getMonth();
          let pushedYear = newLastMonth.getFullYear();

          if (pushedMonth === 0) {
            pushedMonth = 12;
            pushedYear = pushedYear - 1;
          }

          let pushedDate = pushedMonth + "-" + pushedYear;
          this.labelsHolder.push(pushedDate);
          newLastMonth.setMonth(newLastMonth.getMonth() + 1);
        }
        this.labelsHolder.push(currentMonth);
      }

      // remove duplicate last and second last bug
      if (
        this.labelsHolder[this.labelsHolder.length - 1] ===
        this.labelsHolder[this.labelsHolder.length - 2]
      ) {
        this.labelsHolder.pop();
      }
    },
    timeFrameDataUpdate() {
      // timeframes other than All-time
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
      // delete all months before this year
      let currentYear = new Date().getFullYear();
      for (let i = 0; i < this.labelsHolder.length; i++) {
        let label = this.labelsHolder[i];
        let labelYear = label.split("-")[1];
        if (labelYear < currentYear) {
          this.labelsHolder.splice(i, 1);
          this.dataHolder.splice(i, 1);
          i--;
        }
      }
      // delete all dividends before this year
      for (let i = 0; i < this.exFeesArray.length; i++) {
        let dividendYear = this.exFeesArray[i].date.split("-")[1];
        if (dividendYear < currentYear) {
          this.exFeesArray.splice(i, 1);
          i--;
        }
      }
    },
    setYearDate(years) {
      // get one year ago in MM-YYYY
      let currentYear = new Date().getFullYear();
      let currentMonth = new Date().getMonth() + 1;
      let yearAgo = new Date(currentYear - years, currentMonth);

      // delete all months before yearAgo
      for (let i = 0; i < this.labelsHolder.length; i++) {
        let label = this.labelsHolder[i];
        let labelYear = label.split("-")[1];
        let labelMonth = label.split("-")[0];
        let labelDate = new Date(labelYear, labelMonth - 1);

        if (labelDate < yearAgo || labelDate < yearAgo + 1) {
          this.labelsHolder.splice(i, 1);
          this.dataHolder.splice(i, 1);
          i--;
        }
      }

      // delete all dividends of more than one year ago
      for (let i = 0; i < this.exFeesArray.length; i++) {
        let dividendYear = this.exFeesArray[i].date.split("-")[1];
        let dividendMonth = this.exFeesArray[i].date.split("-")[0];
        let dividendDate = new Date(dividendYear, dividendMonth - 1);

        if (dividendDate < yearAgo || dividendDate < yearAgo + 1) {
          this.exFeesArray.splice(i, 1);
          i--;
        }
      }
    },
    updateChart() {
      this.chartData.labels = this.labelsHolder;
      this.chartData.datasets[0].data = this.dataHolder;
    },
  },
  created() {
    this.loadData();
    this.setTheme();
  },
};
</script>

<style scoped>
.dividendChartContainer {
  margin-top: 3rem;
}

h2 {
  color: var(--clr-dark-grey);
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
  padding: 2rem;
  padding-bottom: 0.1rem;
  background-color: var(--clr-very-light-blue);
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow-big);
  border: 1px solid var(--clr-very-light-grey);
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
  margin-bottom: 1.5rem;
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
}

.timeFrame__buttons {
  margin-bottom: 0.5rem;
  display: flex;
}

.timeFrame__btn {
  padding: 0.6rem 0.85rem;
  font-weight: 600;
  font-size: 0.85rem;
  margin-right: 0.5rem;
  background-color: var(--clr-very-light-blue);
  color: var(--clr-grey);
  transform: translateY(0px);
  border: 1px solid var(--clr-medium-light-grey);
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