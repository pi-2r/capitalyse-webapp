<template>
  <ResultCard
    v-if="isDemo"
    title="Total trading volume"
    :resultValue="totTradingVol"
    :to="'/dashboard/demo/trading'"
    btnText="Trading details"
    :withBtn="true"
  />
  <ResultCard
    v-else
    title="Total trading volume"
    :resultValue="totTradingVol"
    :to="'/dashboard/' + portfolioId + '/trading'"
    btnText="View Trades"
    :withBtn="true"
  />
</template>

<script>
import ResultCard from "@/components/dashboard/ResultCard.vue";

import getTotalTradingVolumeMixin from "@/mixins/analytics/getTotalTradingVolume";

export default {
  mixins: [getTotalTradingVolumeMixin],
  components: {
    ResultCard,
  },
  props: {
    withBth: {
      type: Boolean,
      default: false,
    },
    isDemo: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      totTradingVol: 0,
    };
  },
  watch: {
    isThereData() {
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
  },
  methods: {
    loadData() {
      if (this.isThereData) {
        this.totTradingVol = this.getTotalTradingVolume(
          this.currentPortfolio.transactionsFile
        );
      }
    },
  },
  created() {
    this.loadData();
  },
};
</script>

<style>
</style>