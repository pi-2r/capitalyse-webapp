<template>
  <Card class="holdingsCard">
    <section class="tablecontainerHeading">
      <h2 class="tableTitle">Holdings - {{holdingsList.length}}</h2>
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
            <th>Product</th>
            <th class="number">Amount</th>
            <th class="number">Value</th>
            <th class="number">Bought for</th>
            <th class="number">Gain/Loss</th>
            <th class="number">Dividends</th>
            <th class="number">Size</th>
          </tr>
        </thead>
        <tbody>
          <tr :key="holding.id" v-for="holding in holdingsList">
            <HoldingsListItem :holding="holding" :isPublic="isPublic" />
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
    </section>
  </Card>

</template>

<script>
import HoldingsListItem from "./HoldingsListItem.vue";

export default {
  components: {
    HoldingsListItem,
  },
  props: {
    holdingsList: {
      default: null,
      required: true,
    },
  },
  data() {
    return {
      holdingsPages: [],
      holdingsPage: 0,
      isLoading: false,
      scrolling: false,
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
  },
};
</script>

<style scoped>
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