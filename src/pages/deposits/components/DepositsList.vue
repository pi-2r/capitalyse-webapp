<template>
  <Card>
    <section class="tablecontainerHeading">
      <h2 class="tableTitle">
        Deposits & withdrawals
        <span class="amountOfDeposits">- {{ amountOfDeposits }}</span>
      </h2>
      <section class="tableContainerHeading__dropdown">
        <select
          name="sortDeposits"
          id="sortDeposits"
          class="tableSelect"
          v-model="selectedSortType"
        >
          <option value="dateNewToOld">Date (new-old)</option>
          <option value="dateOldToNew">Date (old-new)</option>
          <option value="amountHighToLow">Amount (high-low)</option>
          <option value="amountLowToHigh">Amount (low-high)</option>
          <option value="typeDeposit">Only deposits</option>
          <option value="typeWithdrawal">Only withdrawals</option>
        </select>
      </section>
    </section>
     <section class="wrapper1" @scroll.passive="handleScroll1" ref="wrapper1">
      <section class="div1"></section>
    </section>
    <section class="depositsTableWrapper"
      @scroll.passive="handleScroll2"
      ref="wrapper2">
      <table class="depositsTable div2">
        <thead>
          <tr>
            <th>Type</th>
            <th>Date</th>
            <th>Description</th>
            <th></th>
            <th class="number">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr :key="deposit.id" v-for="deposit in deposits">
            <DepositsListItem :deposit="deposit" />
          </tr>
          <tr v-if="deposits.length < 1 && !isLoading">
            <td class="noDeposits" colspan="3">
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
import DepositsListItem from "./DepositsListItem";
import Spinner from "@/components/ui/Spinner.vue";
import Card from "@/components/ui/Card.vue";

export default {
  components: {
    DepositsListItem,
    Spinner,
    Card,
  },
  props: {
    depositsList: {
      required: true,
    },
  },
  data() {
    return {
      deposits: [],
      isLoading: false,
      error: false,
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
      return this.depositsList !== null;
    },
    amountOfDeposits() {
      return this.deposits.length;
    },
  },
  methods: {
    loadData() {
      if (this.isThereData) {
        this.getDeposits();
        this.isLoading = false;
      } else {
        this.isLoading = true;
      }
    },
    getDeposits() {
      if(this.depositsList != false) {
        this.deposits = JSON.parse(JSON.stringify(this.depositsList));

        this.sortItems();
      }
    },
    sortItems() {
      const sortType = this.selectedSortType;

     if (sortType === "dateOldToNew") {
        this.deposits = this.sortByDateOldToNew(this.deposits);
      } else if (sortType === "amountHighToLow") {
        this.deposits = this.sortByAmountHighToLow(this.deposits);
      } else if (sortType === "amountLowToHigh") {
        this.deposits = this.sortByAmountLowToHigh(this.deposits);
      } else if (sortType === "typeDeposit") {
        this.deposits = this.onlyTypeDeposit(this.deposits);
      } else if (sortType === "typeWithdrawal") {
        this.deposits = this.onlyTypeWithdrawal(this.deposits);
      }
    },
    sortByDateNewToOld(deposits) {
      return deposits.filter((deposit) => {
        return deposit !== null;
      });
    },
    sortByDateOldToNew(deposits) {
      return this.sortByDateNewToOld(deposits).reverse();
    },
    sortByAmountHighToLow(deposits) {
      return deposits.sort((a, b) => {
        return b.amount - a.amount;
      });
    },
    sortByAmountLowToHigh(deposits) {
      return deposits.sort((a, b) => {
        return a.amount - b.amount;
      });
    },
    onlyTypeDeposit(deposits) {
      return deposits.filter((deposit) => {
        return deposit.amount > 0;
      });
    },
    onlyTypeWithdrawal(deposits) {
      return deposits.filter((deposit) => {
        return deposit.amount < 0;
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

.tablecontainerHeading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.75rem;
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

.number {
  text-align: right;
}

::-webkit-scrollbar {
  width: 6px;
}

.depositsTableWrapper {
  overflow: scroll;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: var(--clr-light-grey);
  border-radius: 200rem;
  transition: 0.15s all;
}

.depositsTable {
  border-radius: var(--card-border-radius);
  border-collapse: collapse;
}

.noDeposits {
  padding: 1.75rem;
}

.noDeposits p {
  font-size: 1rem;
  color: var(--clr-grey);
}

table {
  width: 100%;
  /* background-color: var(--clr-very-light-blue); */
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
  background-color: var(--clr-very-light-blue);
}

tr:nth-last-child(1) {
  border-bottom: none;
}

@media screen and (max-width: 825px) {
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
    width: 50rem;
    height: 20px;
  }
  .div2 {
    width: 50rem;
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