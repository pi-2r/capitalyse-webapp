<template>
  <Card class="holdingsCard">
    <section class="tablecontainerHeading">
      <h2 class="tableTitle">
        Holdings
      </h2>
    </section>
    <section class="depositsTableWrapper">
      <table class="depositsTable">
        <thead>
          <tr>
            <th>Name</th>
            <th class="number">Amount</th>
            <th class="number">Total value</th>
          </tr>
        </thead>
        <tbody>
          <tr :key="holding.id" v-for="holding in holdingsList">
            <HoldingsListItem :isDemo="isDemo" :isPublic="isPublic" :holding="holding" />
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
import HoldingsListItem from './HoldingsListItem.vue';

export default {
  components: {
    HoldingsListItem
  },
   props: {
    isDemo: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    holdingsList: {
      default : null,
      required: true,
    },
  },
  data() {
    return {
      holdingsPages: [],
      holdingsPage: 0,
      isLoading: false,
    }
  },
};
</script>

<style scoped>
.holdingsCard {
  margin-bottom: 3rem;
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