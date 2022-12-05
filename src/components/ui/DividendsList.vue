<template>
  <Card class="card">
    <section class="tablecontainerHeading">
      <h2 class="tableTitle">
        Dividends
        <span class="amountOfDividends">- {{ amountOfDividends }}</span>
      </h2>
      <section class="tableContainerHeading__dropdown">
        <select
          name="sortDividends"
          id="sortDividends"
          class="tableSelect"
          v-model="selectedSortType"
        >
          <option value="dateNewToOld">Date (new-old)</option>
          <option value="dateOldToNew">Date (old-new)</option>
          <option value="amountHighToLow">Total (high-low)</option>
          <option value="amountLowToHigh">Total (low-high)</option>
          <option value="feeHighToLow">Tax (high-low)</option>
        </select>
      </section>
    </section>
    <section class="wrapper1" @scroll.passive="handleScroll1" ref="wrapper1">
      <section class="div1"></section>
    </section>
    <section
      class="dividendsTableWrapper"
      @scroll.passive="handleScroll2"
      ref="wrapper2"
    >
      <table class="dividendsTable div2">
        <thead>
          <tr>
            <th>Type</th>
            <th>Date</th>
            <th>Product</th>
            <th class="number">Tax</th>
            <th class="number">Gross</th>
            <th class="number">Net</th>
          </tr>
        </thead>
        <tbody>
          <tr :key="dividend.id" v-for="dividend in dividends">
            <DividendsListItem :dividend="dividend" :name="name" />
          </tr>
          <tr v-if="dividends.length < 1 && !isLoading">
            <td class="noDividends" colspan="3">
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
import DividendsListItem from "./DividendsListItem";
import Spinner from "@/components/ui/Spinner.vue";
import Card from "@/components/ui/Card.vue";

export default {
  components: {
    DividendsListItem,
    Spinner,
    Card,
  },
  props: {
    dividendsList: {
      required: true,
      default: [],
    },
    name: {
      required: true,
    },
  },
  data() {
    return {
      dividends: [],
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
      return this.dividendsList !== null;
    },
    amountOfDividends() {
      return this.dividends.length;
    },
  },
  methods: {
    loadData() {
       this.isLoading = true;
      if (this.isThereData) {
        this.getDividends();
        this.isLoading = false;
      } else {
        this.isLoading = true;
      }
    },
    getDividends() {
      if (this.dividendsList != false) {
        this.dividends = JSON.parse(JSON.stringify(this.dividendsList));

        this.sortItems();
      }
    },
    sortItems() {
      const sortType = this.selectedSortType;
    
      if (sortType === "dateOldToNew") {
        this.dividends = this.sortByDateOldToNew(this.dividends);
      } else if (sortType === "amountHighToLow") {
        this.dividends = this.sortByAmountHighToLow(this.dividends);
      } else if (sortType === "amountLowToHigh") {
        this.dividends = this.sortByAmountLowToHigh(this.dividends);
      } else if (sortType === "typeBuy") {
        this.dividends = this.onlyTypeBuy(this.dividends);
      } else if (sortType === "typeSell") {
        this.dividends = this.onlyTypeSell(this.dividends);
      } else if (sortType === "feeHighToLow") {
        this.dividends = this.sortByFeeHighToLow(this.dividends);
      }
    },
    sortByDateNewToOld(dividends) {
      return dividends.sort((a, b) => a.dateObj - b.dateObj)
    },
    sortByDateOldToNew(dividends) {
      return this.sortByDateNewToOld(dividends).reverse();
    },
    sortByAmountHighToLow(dividends) {
      return dividends.sort((a, b) => Math.abs(b.total) - Math.abs(a.total))
    },
    sortByAmountLowToHigh(dividends) {
      return dividends.sort((a, b) => Math.abs(a.total) - Math.abs(b.total))
    },
    sortByFeeHighToLow(dividends) {
      return dividends.sort((a, b) => {
        return a.dividendTax - b.dividendTax;
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

.amountOfDividends {
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

.dividendsTableWrapper {
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

.dividendsTable {
  border-radius: var(--card-border-radius);
  border-collapse: collapse;
}

.noDividends {
  padding: 1.75rem;
}

.noDividends p {
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