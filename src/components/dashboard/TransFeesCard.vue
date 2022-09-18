<template>
  <ResultCard
    title="Transaction fees"
    :resultValue="totTransFees"
    :to="toLink"
    btnText="View Fees"
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
    toLink() {
      if(this.isDemo) {
        return '/dashboard/demo/fees';
      } else {
        return `/dashboard/${this.portfolioId}/fees`;
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
  watch: {
    isThereData() {
      // op het moment dat er data is worden de totale transactiekosten berekend
      this.loadData();
    },
  },
  methods: {
    loadData() {
      // bereken de totale transactiekosten
      if (this.isThereData) {
        // MIXIN: getTotalTransactionsFeesMixin
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
