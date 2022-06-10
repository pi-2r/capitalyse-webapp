<template>
  <ResultCard
    title="Total Exchange Fees"
    :resultValue="totExchangeFees"
    :withBtn="false"
  />
</template>

<script>
import ResultCard from "@/components/dashboard/ResultCard.vue";

import getTotalExchangeFeesMixin from "@/mixins/analytics/getTotalExchangeFees";

export default {
  mixins: [getTotalExchangeFeesMixin],
  components: {
    ResultCard,
  },
  props: {
    withBth: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      totExchangeFees: 0,
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
      return !!this.currentPortfolio.accountFile;
    },
  },
  methods: {
    loadData() {
      if (this.isThereData) {
        this.totExchangeFees = this.getTotalExchangeFees(
          this.currentPortfolio.accountFile
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