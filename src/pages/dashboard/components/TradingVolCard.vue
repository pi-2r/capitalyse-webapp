<template>
  <ResultCard
    title="Total trading volume"
    :resultValue="totTradingVol"
    :to="toLink"
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
    toLink() {
      if(this.isDemo) {
        return '/dashboard/demo/trading';
      } else {
        return `/dashboard/${this.portfolioId}/trading`;
      }
    },
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