<template>
  <ResultCard
    v-if="isDemo"
    title="Total Transaction Fees"
    :resultValue="totTransFees"
    :to="'/dashboard/demo/fees'"
    btnText="Fees and Costs"
    :withBtn="true"
  />
  <ResultCard
    v-else
    title="Total Transaction Fees"
    :resultValue="totTransFees"
    :to="'/dashboard/' + portfolioId + '/fees'"
    btnText="Fees and Costs"
    :withBtn="true"
  />
</template>

<script>
import ResultCard from "@/components/dashboard/ResultCard.vue";

import cleanNumberMixin from "@/mixins/helpers/cleanNumber";
import includesFromArrayMixin from "@/mixins/helpers/includesFromArray";
import getTotalTransactionsFeesMixin from "@/mixins/analytics/getTotalTransactionsFees";

export default {
  mixins: [
    cleanNumberMixin,
    includesFromArrayMixin,
    getTotalTransactionsFeesMixin,
  ],
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
      totTransFees: 0,
    };
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
  watch: {
    isThereData() {
      this.loadData();
    },
  },
  methods: {
    loadData() {
      if (this.isThereData) {
        this.totTransFees = this.getTotalTransactionsFees(
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
