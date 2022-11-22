<template>
  <Card class="card">
    <section class="tablecontainerHeading">
      <h2 class="tableTitle">
        Trades
        <span class="amountOfTrades">- {{ amountOfTrades }}</span>
      </h2>
      <section class="tableContainerHeading__dropdown">
        <select
          name="sortTrades"
          id="sortTrades"
          class="tableSelect"
          v-model="selectedSortType"
        >
          <option value="dateNewToOld">Date (new-old)</option>
          <option value="dateOldToNew">Date (old-new)</option>
          <option value="amountHighToLow">Total (high-low)</option>
          <option value="amountLowToHigh">Total (low-high)</option>
          <option value="feeHighToLow">Fees (high-low)</option>
          <option value="typeBuy">Buys only</option>
          <option value="typeSell">Sells only</option>
        </select>
      </section>
    </section>
    <section class="wrapper1" @scroll.passive="handleScroll1" ref="wrapper1">
      <section class="div1"></section>
    </section>
    <section
      class="tradesTableWrapper"
      @scroll.passive="handleScroll2"
      ref="wrapper2"
    >
      <table class="tradesTable div2">
        <thead>
          <tr>
            <th>Type</th>
            <th>Date</th>
            <th>Product</th>
            <th class="number">Qty</th>
            <th class="number">Stock price</th>
            <th class="number">Fee</th>
            <th class="number">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr :key="trade.id + Math.random()" v-for="trade in trades">
            <TradesListItem :trade="trade" />
          </tr>
          <tr v-if="trades.length < 1 && !isLoading">
            <td class="noTrades" colspan="3">
              <p>No results</p>
            </td>
          </tr>

          <tr v-if="isLoading">
            <td colspan="3" class="loading">
              <Spinner class="spinner" />
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </Card>
</template>
<script>
import TradesListItem from "./TradesListItem";
import Spinner from "@/components/ui/Spinner.vue";
import Card from "@/components/ui/Card.vue";

export default {
  components: {
    TradesListItem,
    Spinner,
    Card,
  },
  props: {
    tradesList: {
      required: true,
      default: [],
    },
  },
  data() {
    return {
      trades: [],
      isLoading: false,
      error: false,
      scrolling: false,
      selectedSortType: "dateNewToOld",
    };
  },
  watch: {
    isThereData() {
      this.loadData();
    },
    $route() {
      this.loadData();
    },
    selectedSortType() {
      this.loadData();
    },
  },
  computed: {
    isThereData() {
      return this.tradesList !== null;
    },
    amountOfTrades() {
      return this.trades.length;
    },
  },
  methods: {
    loadData() {
       this.isLoading = true;
      if (this.isThereData) {
        this.getTrades();
        this.isLoading = false;
      } else {
        this.isLoading = true;
      }
    },
    getTrades() {
      if (this.tradesList != false) {
        this.trades = JSON.parse(JSON.stringify(this.tradesList));

        this.sortItems();
      }
    },
    sortItems() {
      const sortType = this.selectedSortType;
    
      if (sortType === "dateOldToNew") {
        this.trades = this.sortByDateOldToNew(this.trades);
      } else if (sortType === "amountHighToLow") {
        this.trades = this.sortByAmountHighToLow(this.trades);
      } else if (sortType === "amountLowToHigh") {
        this.trades = this.sortByAmountLowToHigh(this.trades);
      } else if (sortType === "typeBuy") {
        this.trades = this.onlyTypeBuy(this.trades);
      } else if (sortType === "typeSell") {
        this.trades = this.onlyTypeSell(this.trades);
      } else if (sortType === "feeHighToLow") {
        this.trades = this.sortByFeeHighToLow(this.trades);
      }
    },
    sortByDateNewToOld(trades) {
      return trades.filter((trade) => {
        return trade !== null;
      });
    },
    sortByDateOldToNew(trades) {
      return this.sortByDateNewToOld(trades).reverse();
    },
    sortByAmountHighToLow(trades) {
      return trades.sort((a, b) => Math.abs(b.total) - Math.abs(a.total))
    },
    sortByAmountLowToHigh(trades) {
      return trades.sort((a, b) => Math.abs(a.total) - Math.abs(b.total))
    },
    sortByFeeHighToLow(trades) {
      return trades.sort((a, b) => {
        return a.transactionFee - b.transactionFee;
      });
    },
    onlyTypeBuy(trades) {
      return trades.filter((trade) => {
        return trade.total < 0;
      });
    },
    onlyTypeSell(trades) {
      return trades.filter((trade) => {
        return trade.total > 0;
      });
    },
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
  },
  created() {
    this.loadData();
  },
};
</script>


<style scoped>
.card {
  margin-bottom: 3rem;
}

h2 {
  color: var(--clr-grey);
}

.spinner {
  margin: 2rem;
}

.amountOfTrades {
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
}

.tradesTableWrapper {
  overflow: scroll;
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

.tradesTable {
  border-radius: var(--card-border-radius);
  border-collapse: collapse;
}

.noTrades {
  padding: 1.75rem;
}

.noTrades p {
  font-size: 1rem;
  color: var(--clr-grey);
}

table {
  width: 100%;
  background-color: var(--clr-very-light-blue);
}

thead {
  color: var(--clr-dark-grey);
  border-bottom: 1px solid var(--clr-very-light-grey);
}

th {
   padding: 0.65rem 0.65rem;
  font-size: 0.85rem;
  text-align: left;
  font-weight: 500;
  color: var(--clr-dark-grey);
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

tr:nth-last-child(1) {
  border-bottom: none;
}

@media screen and (max-width: 1000px) {
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