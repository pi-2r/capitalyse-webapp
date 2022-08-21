<template>
    <DetailedResultCard
        title="Holding P/L"
        :resultValue="14"
        :subResultValue="41"
        subResultValuePostfix="%"
        colorType="greenRed"
      />
</template>

<script>
import DetailedResultCard from "@/components/ui/DetailedResultCard.vue";

import getHoldingProfitLoss from "@/mixins/analytics/getHoldingProfitLoss";

export default {
  mixins: [getHoldingProfitLoss],
  components: {
    DetailedResultCard,
  },
  props: {
    withBth: {
      type: Boolean,
      default: false,
    },
    isin: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      holdingSize: 0,
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
      return !!this.currentPortfolio.accountFile && !!this.currentPortfolio.portfolioFile && !!this.currentPortfolio.transactionsFile;
    },
  },
  methods: {
    loadData() {
      if (this.isThereData) {
        this.getHoldingProfitLoss = this.getHoldingProfitLoss(
          this.currentPortfolio.accountFile,
          this.currentPortfolio.portfolioFile,
          this.currentPortfolio.transactionsFile,
          this.isin
        );

        console.log(this.getHoldingProfitLoss);
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