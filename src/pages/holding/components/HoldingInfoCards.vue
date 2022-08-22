<template>
  <section class="cardsContainer">
    <DetailedResultCard
      title="Holding P/L"
      :resultValue="holdingProfitLoss.totalPL"
      :subResultValue="holdingProfitLoss.totalPLPercentage"
      subResultValuePostfix="%"
      colorType="greenRed"
    />

    <DetailedResultCard
      title="Position"
      :resultValue="holdingPositionValue.value"
      :subResultValue="holdingPositionValue.percentage"
      subResultValuePostfix="%"
    />

    <DetailedResultCard
      title="Transaction fees"
      :resultValue="holdingTransactionFees.fees"
      :subResultValue="holdingTransactionFees.percentage"
      subResultValuePostfix="%"
    />
  </section>
</template>

<script>
import DetailedResultCard from "@/components/ui/DetailedResultCard.vue";

import currencyMarkup from "@/mixins/helpers/currencyMarkup";
import getHoldingProfitLoss from "@/mixins/analytics/getHoldingProfitLoss";
import getHoldingPositionValue from "@/mixins/analytics/getHoldingPositionValue";
import getHoldingTransactionFees from "@/mixins/analytics/getHoldingTransactionFees";
import getHoldingName from "@/mixins/analytics/getHoldingName";

export default {
  mixins: [
    getHoldingProfitLoss,
    currencyMarkup,
    getHoldingPositionValue,
    getHoldingTransactionFees,
    getHoldingName,
  ],
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
      holdingName: "",
      holdingProfitLoss: 0,
      holdingPositionValue: 0,
      holdingTransactionFees: 0,
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
      return (
        !!this.currentPortfolio.accountFile &&
        !!this.currentPortfolio.portfolioFile &&
        !!this.currentPortfolio.transactionsFile
      );
    },
  },
  methods: {
    loadData() {
      if (this.isThereData) {
        this.holdingProfitLoss = this.getHoldingProfitLoss(
          this.currentPortfolio.accountFile,
          this.currentPortfolio.portfolioFile,
          this.currentPortfolio.transactionsFile,
          this.isin
        );

        this.holdingPositionValue = this.getHoldingPositionValue(
          this.currentPortfolio.portfolioFile,
          this.isin
        );

        this.holdingTransactionFees = this.getHoldingTransactionFees(
          this.currentPortfolio.transactionsFile,
          this.currentPortfolio.portfolioFile,
          this.isin
        );


        this.holdingProfitLoss.totalPL = this.currencyMarkup(
          this.holdingProfitLoss.totalPL
        );
        this.holdingProfitLoss.totalPLPercentage = this.currencyMarkup(
          this.holdingProfitLoss.totalPLPercentage
        );
        this.holdingPositionValue.value = this.currencyMarkup(
          this.holdingPositionValue.value
        );
        this.holdingPositionValue.percentage = this.currencyMarkup(
          this.holdingPositionValue.percentage
        );
        this.holdingTransactionFees.fees = this.currencyMarkup(
          this.holdingTransactionFees.fees
        );
        this.holdingTransactionFees.percentage = this.currencyMarkup(
          this.holdingTransactionFees.percentage
        );
      }
    },
  },
  created() {
    this.loadData();
  },
};
</script>

<style scoped>
.cardsContainer {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  margin-bottom: 3rem;
}

@media screen and (min-width: 650px) {
  .cardsContainer {
    grid-template-columns: 1fr 1fr;
  }
}

@media screen and (min-width: 1150px) {
  .cardsContainer {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>