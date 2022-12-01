<template>
  <Card class="holdingsCard">
    <section class="tablecontainerHeading">
      <h2 class="tableTitle">Holdings - {{ holdingsList.length }}</h2>
    </section>
    <section class="wrapper1" @scroll.passive="handleScroll1" ref="wrapper1">
      <section class="div1"></section>
    </section>
    <section
      class="holdingsTableWrapper"
      @scroll.passive="handleScroll2"
      ref="wrapper2"
    >
      <table class="holdingsTable div2">
        <thead>
          <tr>
            <th>PRODUCT</th>
            <th class="number">AMOUNT</th>
            <th class="number">BOUGHT FOR</th>
            <th class="number">VALUE</th>
            <th class="number">GAIN/LOSS</th>
            <th class="number">DIVIDENDS</th>
            <th class="number">SIZE</th>
          </tr>
        </thead>
        <tbody>
          <tr :key="holding.id" v-for="(holding, index) in holdingsList">
            <HoldingsListItem v-if="index < currentExpandAmount" :holding="holding" :isPublic="isPublic" />
          </tr>
          <section v-if="holdingsList !== null">
            <tr v-if="holdingsList.length < 1 && !isLoading">
              <td class="noHoldings" colspan="3">
                <p>No holdings found</p>
              </td>
            </tr>
          </section>

          <tr v-if="isLoading">
            <td colspan="3" class="loading">
              <Spinner class="spinner" />
            </td>
          </tr>
        </tbody>
      </table>
      <section class="expandSection" v-if="holdingsList.length > 6">
        <section class="expandSection__btns">
          <span class="expandSection__showMoreBtn" @click="expandAtExpandRate" v-if="currentExpandAmount !== holdingsList.length">
            {{showOrHideAtExpandRateBtnText}}
            <Icon icon="material-symbols:keyboard-arrow-down-rounded" :class="{ expandRateBtnIcon__reverse: currentExpandAmount === holdingsList.length }"/>
          </span>
          <span class="expandSection__showMoreBtn" @click="showOrHideAll">
            {{ showOrHideAllBtnText }}
            <Icon icon="material-symbols:keyboard-double-arrow-down-rounded" :class="{ expandRateBtnIcon__reverse: currentExpandAmount === holdingsList.length }"/>
          </span>
        </section>
      </section>
    </section>
  </Card>
</template>

<script>
import HoldingsListItem from "./HoldingsListItem.vue";
import { Icon } from "@iconify/vue";

export default {
  components: {
    HoldingsListItem,
    Icon,
  },
  props: {
    holdingsList: {
      default: null,
      required: true,
    },
    isPublic: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      holdingsPages: [],
      holdingsPage: 0,
      isLoading: false,
      scrolling: false,
      currentExpandAmount: 6,
      expandRate: 5,
    };
  },
  methods: {
    handleScroll1() {
      if (this.scrolling) {
        this.scrolling = false;
        return;
      }
      this.scrolling = true;
      this.$refs["wrapper2"].scrollLeft = this.$refs["wrapper1"].scrollLeft;
    },
    handleScroll2() {
      if (this.scrolling) {
        this.scrolling = false;
        return;
      }
      this.scrolling = true;
      this.$refs["wrapper1"].scrollLeft = this.$refs["wrapper2"].scrollLeft;
    },
    expandAtExpandRate() {
      // with max of this.holdingsList.length
      this.currentExpandAmount = Math.min(
        this.currentExpandAmount + this.expandRate,
        this.holdingsList.length
      );
    },
    showOrHideAll() {
      if (this.currentExpandAmount === this.holdingsList.length) {
        this.currentExpandAmount = 6;
      } else {
        this.currentExpandAmount = this.holdingsList.length;
      }
    },
  },
  computed: {
    showOrHideAllBtnText() {
      if (this.currentExpandAmount === this.holdingsList.length) {
        return "Hide";
      } else {
        return `Show all ${this.holdingsList.length}`;
      }
    },
    showOrHideAtExpandRateBtnText() {
      if (this.currentExpandAmount === this.holdingsList.length) {
        return `Hide ${this.expandRate} expanded`;
      } else {
        return `Show ${this.hiddenHoldingsAmount} more`;
      }
    },
    hiddenHoldingsAmount() {
      if(this.holdingsList.length - this.currentExpandAmount < 0) {
        return 0;
      } else if(this.holdingsList.length - this.currentExpandAmount < this.expandRate) {
        return this.holdingsList.length - this.currentExpandAmount;
      } else {
        return this.expandRate;
      }
    },
  },
};
</script>

<style scoped>
.expandRateBtnIcon__reverse {
  transform: rotate(180deg);
}
.expandSection {
  display: flex;
  align-items: center;
  justify-content: center;
}

.expandSection__btns {
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  gap: 3rem;
}

.expandSection__showMoreBtn {
  color: var(--clr-medium-light-grey-2);
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  gap: 0.25rem;
}

.expandSection__showMoreBtn:hover {
  color: var(--clr-dark-grey);
}

.tableTitle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.holdingsCard {
  margin-bottom: 1rem;
}

h2 {
  color: var(--clr-grey);
}

.spinner {
  margin: 2rem;
}

.amountOfDeposits {
  color: var(--clr-grey);
  font-size: 1rem;
}

select {
  padding: 0.5rem;
  border-radius: var(--btn-radius);
  background-color: var(--clr-very-light-blue);
  color: var(--clr-grey);
  font-weight: 600;
  font-size: 1rem;
  border: 1px solid var(--clr-medium-light-grey);
  box-shadow: var(--btn-shadow);
  transition: 0.15s all;
}

select:hover {
  cursor: pointer;
  border-color: var(--clr-medium-light-grey-2);
}

.tablecontainerHeading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.75rem;
  padding-bottom: 1rem;
}

.number {
  text-align: right;
}

::-webkit-scrollbar {
  width: 6px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: var(--clr-light-grey);
  border-radius: 200rem;
  transition: 0.15s all;
}

.depositsTable {
  width: 100%;
  border-radius: var(--card-border-radius);
  border-collapse: collapse;
}

.noHoldings {
  padding: 1.75rem;
}

.noHoldings p {
  font-size: 1rem;
  color: var(--clr-grey);
}

table {
  width: 100%;
  background-color: var(--clr-very-light-blue);
  border-collapse: collapse;
}

thead {
  color: var(--clr-dark-grey);
  border-bottom: 1px solid var(--clr-very-light-grey);
}

th {
  padding: 0.65rem 0.65rem;
  font-size: 0.8rem;
  text-align: left;
  font-weight: 500;
  color: var(--clr-medium-light-grey-2);
}
th:nth-of-type(1) {
  padding-left: 1.75rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
th:nth-last-child(1) {
  padding-right: 1.75rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
tr {
  border-bottom: 1px solid var(--clr-very-light-grey);
  transition: 0.1s all;
}

tr:nth-last-of-type(1) {
  border-bottom: none;
}

.holdingsTableWrapper {
  overflow: scroll;
}

@media screen and (max-width: 1100px) {
  .wrapper1,
  .wrapper2 {
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
  }
  .wrapper1 {
    height: 20px;
  }
  .wrapper2 {
    height: 200px;
  }
  .div1 {
    width: 60rem;
    height: 20px;
  }
  .div2 {
    width: 60rem;
    height: 200px;
    overflow: auto;
  }
}
@media screen and (max-width: 650px) {
  .tablecontainerHeading {
    align-items: baseline;
    flex-direction: column;
    gap: 1rem;
  }
}
</style>