<template>
  <section class="cardWrapper">
    <Button class="secondary toggleBuySellBtn" @click="toggleBuySell">
      <Icon
        icon="heroicons-outline:switch-horizontal"
        color="var(--clr-blue)"
        height="25"
      />
    </Button>
    <section>
      <ResultCard
        class="card"
        :title="title"
        :resultValue="
          mostFreqTraded +
          ' (' +
          timesTraded +
          ' time' +
          (timesTraded > 1 || timesTraded == 0 ? 's' : '') +
          ')'
        "
        :withBtn="false"
        :numberResult="false"
      />
    </section>
  </section>
</template>

<script>
import ResultCard from "@/components/dashboard/ResultCard.vue";

import getMostFrequentBuyOrSell from "@/mixins/analytics/getMostFrequentBuyOrSell.js";

import { Icon } from "@iconify/vue";

export default {
  mixins: [getMostFrequentBuyOrSell],
  components: {
    ResultCard,
    Icon,
  },
  props: {
    withBth: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mostFreqBuyOrSellList: [],
      buyOrSell: "buy",
    };
  },
  watch: {
    isThereData() {
      this.loadData();
    },
    $route() {
      this.loadData();
    },
    buyOrSell() {
      this.loadData();
    },
  },
  computed: {
    portfolioId() {
      return this.$route.params.id;
    },
    currentPortfolio() {
      return this.$store.getters["files/getCurrentPortfolio"];
    },
    isThereData() {
      return !!this.currentPortfolio.transactionsFile;
    },
    mostFreqTraded() {
      if (this.isThereData && this.mostFreqBuyOrSellList[0]) {
        return this.mostFreqBuyOrSellList
          ? this.mostFreqBuyOrSellList[0][0]
          : "No data";
      }
      return "No products";
    },
    timesTraded() {
      if (this.isThereData && this.mostFreqBuyOrSellList[0]) {
        return this.mostFreqBuyOrSellList
          ? this.mostFreqBuyOrSellList[0][1]
          : 0;
      }
      return 0;
    },
    title() {
      if (this.isThereData) {
        return this.buyOrSell === "buy"
          ? "Most times bought"
          : "Most times sold";
      }
      return "Most times bought";
    },
  },
  methods: {
    toggleBuySell() {
      this.buyOrSell = this.buyOrSell === "buy" ? "sell" : "buy";
    },
    loadData() {
      if (this.isThereData) {
        if (this.buyOrSell === "buy") {
          this.mostFreqBuyOrSellList = this.getMostFrequentBuyOrSell(
            this.currentPortfolio.transactionsFile,
            "buy"
          );
        } else if (this.buyOrSell === "sell") {
          this.mostFreqBuyOrSellList = this.getMostFrequentBuyOrSell(
            this.currentPortfolio.transactionsFile,
            "sell"
          );
        }
      }
    },
  },
  created() {
    this.loadData();
  },
};
</script>

<style scoped>
.toggleBuySellBtn {
  position: absolute;
  padding: 0.3rem 0.4rem;
  right: 0.5rem;
  top: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  box-shadow: none;
  background-color: transparent;
  border: 1px solid transparent;
}

.toggleBuySellBtn:hover {
  cursor: pointer;
  box-shadow: var(--box-shadow-small);
  background-color: var(--clr-white);
  border: 1px solid var(--clr-light-grey);
}

.card {
  box-shadow: none;
  padding: 0;
  height: 100%;
  grid-gap: 0;
  border: none;
}

.cardWrapper {
  position: relative;
  width: 100%;
  background-color: var(--clr-very-light-blue);
  display: flex;
  justify-content: center;
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow-big);
  border: 1px solid var(--clr-very-light-grey);
}
</style>