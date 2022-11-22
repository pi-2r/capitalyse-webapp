<template>
  <section class="feesChartContainer">
    <!-- time frame -->
    <section class="timeFrame" v-if="!hideTimeFrameBtns">
      <!-- radios -->
      <section class="timeFrame__buttons">
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
        <button
          @click="timeFrameChange"
          :class="{ btnActive: selectedTimeFrame == timeFrameOptions.allTime }"
          class="timeFrame__btn"
        >
          {{ timeFrameOptions.allTime }}
        </button>
      </section>
      <section class="chartFilter">
        <button
          @click="toggleFilterButtonOpen"
          class="chartFilter__btn timeFrame__btn"
          :class="{ btnActive: isFilterPopupOpen }"
        >
          Filter 
          <span class="filterAmountSelected" v-if="amountOfFiltersSelected > 0">
            {{amountOfFiltersSelected}}
            </span>
          <Icon
            icon="material-symbols:keyboard-arrow-down-rounded"
            height="18px"
            :class="{ filterPopupOpen__icon: isFilterPopupOpen }"
          />
        </button>
        <Dropdown
          :isOpen="isFilterPopupOpen"
          @click-outside-dropdown="toggleFilterButtonOpen"
        >
          <section class="filterPopup__heading">
            <p class="filterPopup__title">Show</p>
            <p class="filterPopup__reset" v-if="isAnyFilterSelected" @click="resetFilters">Reset</p>
          </section>
          <section class="filters">
            <section class="filterGroup">
              <input
                class="filterCheckbox"
                type="checkbox"
                name="filter-transaction-fees"
                id="filter-transaction-fees"
                v-model="isShowingTransactionFees"
                @change="filterCheckboxClicked()"
              />
              <label class="filterLabel" for="filter-transaction-fees"
                >Transaction fees</label
              >
            </section>
            <section class="filterGroup">
              <input
                class="filterCheckbox"
                type="checkbox"
                name="filter-exchange-fees"
                id="filter-exchange-fees"
                v-model="isShowingExchangeFees"
                @change="filterCheckboxClicked()"
              />
              <label class="filterLabel" for="filter-exchange-fees"
                >Exchange fees</label
              >
            </section>
            <section class="filterGroup">
              <input
                class="filterCheckbox"
                type="checkbox"
                name="filter-ftt-fees"
                id="filter-ftt-fees"
                v-model="isShowingFTTFees"
                @change="filterCheckboxClicked()"
              />
              <label class="filterLabel" for="filter-ftt-fees">Financial transaction tax</label>
            </section>
            <section class="filterGroup">
              <input
                class="filterCheckbox"
                type="checkbox"
                name="filter-sd-fees"
                id="filter-sd-fees"
                v-model="isShowingStampDutyFees"
                @change="filterCheckboxClicked()"
              />
              <label class="filterLabel" for="filter-sd-fees"
                >Stamp duty fees</label
              >
            </section>
            <section class="filterGroup">
              <input
                class="filterCheckbox"
                type="checkbox"
                name="filter-adr-fees"
                id="filter-adr-fees"
                v-model="isShowingADRFees"
                @change="filterCheckboxClicked()"
              />
              <label class="filterLabel" for="filter-adr-fees"
                >ADR/GDR fees</label
              >
            </section>
          </section>
        </Dropdown>
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
import { Icon } from "@iconify/vue";
import Dropdown from "@/components/ui/Dropdown.vue";

export default {
  components: {
    BarChart,
    Icon,
    Dropdown,
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
    },
  },
  data() {
    return {
      test: null,
      isLoading: true,

      // filters
      isShowingTransactionFees: false,
      isShowingExchangeFees: false,
      isShowingFTTFees: false,
      isShowingStampDutyFees: false,
      isShowingADRFees: false,

      isFilterPopupOpen: false,
      selectedTimeFrame: "Max",
      feesArray: [],
      chartErrorMsg: null,
      timeFrameOptions: {
        allTime: "Max",
        yearToDate: "YTD",
        oneYear: "1Y",
        threeYears: "3Y",
        fiveYears: "5Y",
      },
      chartData: {
        labels: [],
        datasets: [],
      },
    };
  },
  computed: {
    amountOfFiltersSelected() {
      let amtSelected = 0
      this.isShowingTransactionFees ? amtSelected+=1 : null;
      this.isShowingExchangeFees ? amtSelected+=1 : null;
      this.isShowingFTTFees ? amtSelected+=1 : null;
      this.isShowingStampDutyFees ? amtSelected+=1 : null;
      this.isShowingADRFees ? amtSelected+=1 : null;
      return amtSelected
    },
    isAnyFilterSelected() {
      return this.isShowingTransactionFees || this.isShowingExchangeFees || this.isShowingFTTFees || this.isShowingStampDutyFees || this.isShowingADRFees
    },
    toLink() {
      if (this.isPublic === true) {
        return `/shared/${this.$route.params.uid}/${this.$route.params.pid}/fees`;
      } else {
        return `/dashboard/${this.$route.params.id}/fees`;
      }
    },
    totalFees() {
      let total = 0;
      for (let i = 0; i < this.chartData.datasets.length; i++) {
        let dataList = this.chartData.datasets[i].data;
        // add all the fees together
        for (let j = 0; j < dataList.length; j++) {
          total += dataList[j];
        }
      }
      return total;
    },
    averageFeesPerMonth() {
      // if theres fees
      if (this.chartData.datasets.length > 0) {
        let total = 0;
        for (let i = 0; i < this.chartData.datasets.length; i++) {
          let dataList = this.chartData.datasets[i].data;
          // add all the feess together
          for (let j = 0; j < dataList.length; j++) {
            total += dataList[j];
          }
        }
        let average = (total / this.chartData.labels.length).toFixed(2);

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
    resetFilters() {
      this.isShowingTransactionFees = false
      this.isShowingExchangeFees = false
      this.isShowingFTTFees = false
      this.isShowingStampDutyFees = false
      this.isShowingADRFees = false
      this.isFilterPopupOpen = false

      this.getFees()
      this.timeFrameDataUpdate();
    },
    filterCheckboxClicked() {
      this.getFees();
      this.timeFrameDataUpdate();

      const showTrans = this.isShowingTransactionFees;
      const showExchange = this.isShowingExchangeFees;
      const showFTT = this.isShowingFTTFees;
      const showStampDuty = this.isShowingStampDutyFees;
      const showADR = this.isShowingADRFees;

      if (showTrans || showExchange || showFTT || showStampDuty || showADR) {
        for (let i = 0; i < this.chartData.datasets.length; i++) {
          const feeType = this.chartData.datasets[i];
          if (!showTrans && feeType.label == "Transaction Fees") {
            this.chartData.datasets[i].data = [];
          }
          if (!showExchange && feeType.label == "Exchange Connection Fees") {
            this.chartData.datasets[i].data = [];
          }
          if (!showFTT && feeType.label == "Financial Transaction Tax") {
            this.chartData.datasets[i].data = [];
          }
          if (!showStampDuty && feeType.label == "Stamp Duty") {
            this.chartData.datasets[i].data = [];
          }
          if (!showADR && feeType.label == "ADR/GDR Pass-Through Fees") {
            this.chartData.datasets[i].data = [];
          }
        }
      }
    },
    toggleFilterButtonOpen() {
      if (this.isFilterPopupOpen === false) {
        this.isFilterPopupOpen = true;
      } else {
        this.isFilterPopupOpen = false;
      }
    },
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
        "#B72C2A",
        "#962422",
        "#741C1A",
        "#531413",
        "#320C0B",
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
        this.selectedTimeFrame = e?.target?.innerText || e;
        this.isThereData ? this.getFees() : null;
        this.isThereData ? this.filterCheckboxClicked() : null;
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
.filterAmountSelected {
  min-width: 18px;
  line-height: 18px;
  margin-left: 0.1rem;
  margin-right: 0.1rem;
  font-size: 0.7rem;
  background-color: var(--clr-blue);
  color: var(--clr-white);
  border-radius: 100%;
}
.filterPopup__reset {
  font-size: 0.85rem;
  color: var(--clr-blue)
}
.filterPopup__reset:hover {
  text-decoration: underline;
  cursor: pointer;
}
.filterPopup__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
 margin-bottom: 0.5rem;
  padding: 0.1rem;
  padding-bottom: 0.25rem;
  color: var(--clr-grey);
  border-bottom: 1px solid var(--clr-light-grey);
}
.filterPopup__title {
  font-weight: 500;
 
}
.filterGroup {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
}
.filterCheckbox {
  appearance: auto;

}

.filterCheckbox:hover,
.filterLabel:hover {
  cursor: pointer;
}
.filterLabel {
   gap: 0.5rem;
   overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.8rem;
}

.filters {
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
 
}
.cutText {
  width: 18rem;
 
}

.chartFilter {
  position: relative;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: flex-start;
  margin-left: 2rem;
}

.chartFilter__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  margin-right: 0 !important;
}
.chartFilter__btnIcon {
  display: flex;
  align-items: center;
  justify-content: center;
}
.filterPopupOpen__icon {
  transform: rotate(180deg);
}

.feesChartContainer {
  margin-bottom: 3rem;
}

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
  padding: 0.4rem 0.7rem;
  font-weight: 600;
  font-size: 0.85rem;
  margin-right: 0.5rem;
  background-color: var(--clr-very-light-blue);
  color: var(--clr-grey);
  transform: translateY(0px);
  border: 1px solid var(--clr-light-grey);
  border-radius: var(--btn-radius);
  user-select: none;
  box-shadow: var(--box-shadow-big);
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

@media screen and (max-width: 400px) {
  .timeFrame__buttons {
    overflow-x: scroll;
  }
}
</style>