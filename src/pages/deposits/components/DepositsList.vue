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
          <option value="typeDeposit">Deposits only</option>
          <option value="typeWithdrawal">Withdrawals only</option>
        </select>
      </section>
    </section>
    <section class="depositsTableWrapper">
      <table class="depositsTable">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
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
        this.deposits = this.depositsList

        this.sortItems();
      }
    },
    sortItems() {
      const sortType = this.selectedSortType;

      if (sortType === "dateNewToOld") {
        this.deposits = this.sortByDateNewToOld(this.deposits);
      } else if (sortType === "dateOldToNew") {
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

.noDeposits {
  padding: 1.75rem;
}

.noDeposits p {
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
  padding: 1.2rem 1.75rem;
  text-align: left;
  font-weight: 500;
  color: var(--clr-dark-grey);
}

tr {
  border-bottom: 1px solid var(--clr-very-light-grey);
  transition: 0.1s all;
}

tr:nth-last-child(1) {
  border-bottom: none;
}

@media screen and (max-width: 650px) {
  th {
    padding: 1.5rem;
  }

  th:nth-child(2) {
    display: none;
  }

  .tablecontainerHeading {
    align-items: baseline;
    flex-direction: column;
    gap: 1rem;
  }
}
</style>