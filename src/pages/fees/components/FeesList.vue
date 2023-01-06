<template>
  <Card class="card">
    <section class="tablecontainerHeading">
      <h2 class="tableTitle">
        Fee events
        <span class="amountOfFees">- {{ amountOfFees }}</span>
      </h2>
      <section class="tableContainerHeading__dropdown">
        <select
          name="sortFees"
          id="sortFees"
          class="tableSelect"
          v-model="selectedSortType"
        >
          <option value="dateNewToOld">Date (new-old)</option>
          <option value="dateOldToNew">Date (old-new)</option>
          <option value="amountHighToLow">Amount (high-low)</option>
          <option value="typeTrans">Transaction fees only</option>
          <option value="typeExchange">Exchange conn. fees only</option>
          <option value="typeADR">ADR/GDR Fees only</option>
          <option value="typeStampDuty">Stamp Duty fees only</option>
          <option value="typeFTT">FTT fees only</option>
        </select>
      </section>
    </section>
    <section class="wrapper1" @scroll.passive="handleScroll1" ref="wrapper1">
      <section class="div1"></section>
    </section>
    <section
      class="feesTableWrapper"
      @scroll.passive="handleScroll2"
      ref="wrapper2"
    >
      <table class="feesTable div2">
        <thead>
          <tr>
            <th>Type</th>
            <th>Date</th>
            <th>Description</th>
            <th class="number">Fee Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr :key="fee.id + Math.random()" v-for="fee in fees">
            <FeesListItem :fee="fee" />
          </tr>
          <tr v-if="fees.length < 1 && !isLoading">
            <td class="noFees" colspan="3">
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
import FeesListItem from "./FeesListItem";
import Spinner from "@/components/ui/Spinner.vue";
import Card from "@/components/ui/Card.vue";

export default {
  components: {
    FeesListItem,
    Spinner,
    Card,
  },
  props: {
    feesList: {
      required: true,
      default: [],
    },
  },
  data() {
    return {
      fees: [],
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
      return this.feesList !== null;
    },
    amountOfFees() {
      return this.fees.length;
    },
  },
  methods: {
    loadData() {
      this.isLoading = true;
      if (this.isThereData) {
        this.getFees();
        this.isLoading = false;
      } else {
        this.isLoading = true;
      }
    },
    getFees() {
      if (this.feesList != false) {
        this.fees = JSON.parse(JSON.stringify(this.feesList));

        this.sortItems();
      }
    },
    sortItems() {
      const sortType = this.selectedSortType;

      if (sortType === "dateOldToNew") {
        this.fees = this.sortByDateOldToNew(this.feesList);
      } else if (sortType === "amountHighToLow") {
        this.fees = this.sortByAmountHighToLow(this.fees);
      } else if (sortType === "typeExchange") {
        this.fees = this.sortByType(this.fees, "exchange-fee");
      } else if (sortType === "typeFTT") {
        this.fees = this.sortByType(this.fees, "ftt-fee");
      } else if (sortType === "typeTrans") {
        this.fees = this.sortByType(this.fees, "transaction-fee");
      } else if (sortType === "typeADR") {
        this.fees = this.sortByType(this.fees, "adr-gdr-fee");
      } else if (sortType === "typeStampDuty") {
        this.fees = this.sortByType(this.fees, "stamp-duty-fee");
      }
    },
    sortByDateNewToOld(fees) {
      return fees.filter((fee) => {
        return fee !== null;
      });
    },
    sortByDateOldToNew(fees) {
      return this.sortByDateNewToOld(fees).reverse();
    },
    sortByAmountHighToLow(fees) {
      return fees.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
    },
    sortByType(fees, type) {
      return fees.filter((fee) => {
        return fee.type === type;
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

.amountOfFees {
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

.feesTableWrapper {
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

.feesTable {
  border-radius: var(--card-border-radius);
  border-collapse: collapse;
}

.noFees {
  padding: 1.75rem;
}

.noFees p {
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
  text-transform: uppercase;
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