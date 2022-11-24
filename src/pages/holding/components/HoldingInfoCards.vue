<template>
  <section class="cardsContainer">
    <DetailedResultCard
      title="Holding P/L"
      :resultValue="holdingProfitLoss.totalPL"
      :subResultValue="holdingProfitLoss.totalPLPercentage"
      subResultValuePostfix="%"
      :isSubResultACurrency="false"
      colorType="greenRed"
    />

    <DetailedResultCard
      :showTooltip="true"
      tooltipText="Value of the holding in Euro. The percentage shows the amount it takes up in your portfolio."
      title="Position"
      :resultValue="holdingPositionValue.value"
      :subResultValue="holdingPositionValue.percentage"
      :isSubResultACurrency="false"
      subResultValuePostfix="%"
    />

    <DetailedResultCard
       :showTooltip="true"
      tooltipText="Transaction fees for this product. The percentage shows your total fees divided by total trading volume for this holding. Try to keep it below 0.5%."
      title="Transaction fees"
      :resultValue="holdingTransactionFees.fees"
      :subResultValue="holdingTransactionFees.percentage"
      :isSubResultACurrency="false"
      subResultValuePostfix="%"
    />
  </section>
</template>

<script>
import DetailedResultCard from "@/components/ui/DetailedResultCard.vue";

export default {
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
    holdingProfitLoss: {
      required: true,
    },
    holdingPositionValue: {
      required: true,
    },
    holdingTransactionFees: {
      required: true,
    }  
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