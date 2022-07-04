<template>
  <section class="portfolioCards__container">
    <DetailedResultCard
      title="Total P/L"
      :resultValue="totalProfitLoss"
      :subResultValue="totalProfitLossPercentage"
      subResultValuePostfix="%"
      colorType="greenRed"
    />
    <DetailedResultCard
      title="Invested"
      :resultValue="totalInvestedAmount"
      :subResultValue="investedPercentage"
      subResultValuePostfix="%"
    />
    <DetailedResultCard
      title="Total balance"
      :resultValue="totalBalanceAmount"
      :subResultValue="cashAmount"
      subResultValuePrefix="Cash €"
    />
  </section>
</template>
<script>
import getTotalBalance from "@/mixins/analytics/getTotalBalance";
import getTotalInvestedAmount from "@/mixins/analytics/getTotalInvestedAmount";
import getTotalProfitLoss from "@/mixins/analytics/getTotalProfitLoss";
import currencyMarkup from "@/mixins//helpers/currencyMarkup";

import DetailedResultCard from "./DetailedResultCard.vue";

export default {
  components: {
    DetailedResultCard,
  },
  data() {
    return {
      isThereNoPortfolioFile: false,
    };
  },
  mixins: [
    getTotalBalance,
    getTotalInvestedAmount,
    currencyMarkup,
    getTotalProfitLoss,
  ],
  computed: {
    currentPortfolio() {
      return this.$store.getters["files/getCurrentPortfolio"];
    },
    isThereData() {
      return (
        !!this.currentPortfolio.portfolioFile &&
        !!this.currentPortfolio.accountFile
      );
    },
    isTherePortfolioFile() {
      return !!this.currentPortfolio.portfolioFile;
    },
    isThereAccountFile() {
      return !!this.currentPortfolio.accountFile;
    },
    totalBalanceAmount() {
      if (this.isThereData) {
        let tot = this.getTotalBalance(this.currentPortfolio.portfolioFile);
        return this.currencyMarkup(tot);
      }
      return 0;
    },
    totalInvestedAmount() {
      if (this.isThereData) {
        let tot = this.getTotalInvestedAmount(
          this.currentPortfolio.portfolioFile
        );
        return this.currencyMarkup(tot);
      }
      return 0;
    },
    investedPercentage() {
      if (this.isThereData) {
        // totaal geinvesteerd / totaal balans * 100
        let totInvested = this.getTotalInvestedAmount(
          this.currentPortfolio.portfolioFile
        );
        let totBalance = this.getTotalBalance(
          this.currentPortfolio.portfolioFile
        );
        let perc = (totInvested / totBalance) * 100;
        return this.currencyMarkup(perc);
      }
      return 0;
    },
    cashAmount() {
      if (this.isThereData) {
        // totaal balans - totaal geinvesteerd
        let totInvested = this.getTotalInvestedAmount(
          this.currentPortfolio.portfolioFile
        );
        let totBalance = this.getTotalBalance(
          this.currentPortfolio.portfolioFile
        );
        let perc = totBalance - totInvested;
        return this.currencyMarkup(perc);
      }
      return 0;
    },
    totalProfitLoss() {
      if (this.isThereData) {
        let totProfitLoss = this.getTotalProfitLoss(
          this.currentPortfolio.portfolioFile,
          this.currentPortfolio.accountFile
        );
        return this.currencyMarkup(totProfitLoss);
      }
      return 0;
    },
    totalProfitLossPercentage() {
      if (this.isThereData) {
        // totaal winst / totaal geinvesteerd * 100
        let totProfitLoss = this.getTotalProfitLoss(
          this.currentPortfolio.portfolioFile,
          this.currentPortfolio.accountFile
        );
        let totInvested = this.getTotalInvestedAmount(
          this.currentPortfolio.portfolioFile
        );
        let perc = (totProfitLoss / totInvested) * 100;
        return this.currencyMarkup(perc);
      }
      return 0;
    },
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