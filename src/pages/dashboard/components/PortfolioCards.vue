<template>
  <section class="portfolioCards__container">
    <DetailedResultCard
      title="Total P/L"
      :resultValue="totalProfitLoss"
      :subResultValue="totalProfitLossPercentage"
      :isSubResultACurrency="false"
      subResultValuePostfix="%"
      colorType="greenRed"
    />
    <DetailedResultCard
      title="Invested"
      :resultValue="totalInvested"
      :subResultValue="totalInvestedPercentage"
      :isSubResultACurrency="false"
      subResultValuePostfix="%"
    />
    <DetailedResultCard
      title="Total balance"
      :resultValue="totalBalance"
      :subResultValue="totalCash"
      subResultValuePrefix="Cash"
    />
  </section>
</template>
<script>
import DetailedResultCard from "@/components/ui/DetailedResultCard.vue";

export default {
  components: {
    DetailedResultCard,
  },
  props: ['totalInvested', 'totalInvestedPercentage', 'totalBalance', 'totalCash', 'totalProfitLoss', 'totalProfitLossPercentage'],
  data() {
    return {
      isThereNoPortfolioFile: false,
      test: 0,
    };
  },
};
</script>
<style scoped>
.portfolioCards__container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 3rem;
}

/* anims */
.slide-fade-enter-active {
  transition: all 0.25s ease-in-out;
}
.slide-fade-leave-active {
  transition: all 0.25s ease-in-out;
}
.slide-fade-enter-from {
  transform: translateX();
  opacity: 0;
}

.slide-fade-leave-to {
  opacity: 0;
}

@media screen and (min-width: 650px) {
  .portfolioCards__container {
    grid-template-columns: 1fr 1fr;
  }
}

@media screen and (min-width: 1050px) {
  .portfolioCards__container {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>