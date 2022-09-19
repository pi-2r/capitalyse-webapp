<template>
  <ResultCard
    title="Total times traded"
    :resultValue="totTradeCount + ' trades'"
    :to="toLink"
    btnText="View Trades"
    :withBtn="true"
    :numberResult="false"
    :largeBlueText="true"
  />
</template>

<script>
import ResultCard from "@/components/dashboard/ResultCard.vue";

import getTradeCountMixin from "@/mixins/analytics/getTradeCount";

export default {
  mixins: [getTradeCountMixin],
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
      totTradeCount: 0,
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
        this.totTradeCount = this.getTradeCount(
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