<template>
  <transition name="slide-fade" mode="out-in">
    <NotificationBar
      v-if="isThereNoPortfolioFile"
      :key="isThereNoPortfolioFile"
      message="A new update requires your portfolio to include the Portfolio.csv file.
            Please delete this portfolio and create a new one containing the Portfolio.csv file found at Degiro > Portfolio > Export."
      type="error"
    />
  </transition>

  <section class="portfolioCards__container">
    <DetailedResultCard
      title="Capital Gains"
      :resultValue="totalProfitLoss"
      :subResultValue="totalProfitLossPercentage"
      subResultValuePostfix="%"
      colorType="greenRed"
    />

    <DetailedResultCard
      title="Portfolio"
      :resultValue="totalInvestedAmount"
      :subResultValue="investedPercentage"
      subResultValuePostfix="%"
    />

    <DetailedResultCard
      title="Total Balance"
      :resultValue="totalBalanceAmount"
      :subResultValue="cashAmount"
      subResultValuePrefix="Cash €"
    />
  </section>
</template>
<script>
import NotificationBar from "@/components/ui/NotificationBar";

import getTotalBalance from "@/mixins/analytics/getTotalBalance";
import getTotalInvestedAmount from "@/mixins/analytics/getTotalInvestedAmount";
import getTotalProfitLoss from "@/mixins/analytics/getTotalProfitLoss";
import currencyMarkup from "@/mixins//helpers/currencyMarkup";

import DetailedResultCard from "./DetailedResultCard.vue";

export default {
  components: {
    NotificationBar,
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
  watch: {
    isThereAccountFile() {
      this.check();
    },
    isTherePortfolioFile() {
      this.check();
    },
  },
  methods: {
    check() {
      setTimeout(() => {
        if (!this.isThereData) {
          this.isThereNoPortfolioFile = true;
        }
      }, 2500);
    },
  },
  created() {
    this.check();
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