<template>
  <Header />
  <section class="container" v-if="!isLoading">
    
    <Breadcrumbs
      baseLink="/portfolios"
      baseLinkName="Portfolios"
      :secondLink="
        this.isPublic
          ? `/shared/${this.$route.params.uid}/${this.$route.params.pid}`
          : '/dashboard/' + this.$route.params.id
      "
      :secondLinkName="
        this.isPublic
          ? tradingAnalytics.portfolioMetadata.portfolioName
          : portfolioInfo.portfolioName
      "
      thirdLink="#"
      thirdLinkName="Trading"
    />

    <section class="titleAndBackButtonContainer">
      <BackButton />
      <h1>Trading</h1>
    </section>

    <section class="cardsContainer">
      <TradeCountCard
        :withBtn="false"
        :totalTradeCount="tradingAnalytics.totalTradeCount"
      />
      <MostFreqBuyOrSell
        :mostFrequentBuysList="tradingAnalytics.mostFrequentBuysList"
        :mostFrequentSellsList="tradingAnalytics.mostFrequentSellsList"
      />
      <MostFreqTradedCard
        :mostFrequentlyTradedList="tradingAnalytics.mostFrequentlyTradedList"
      />
    </section>
    <section>
      <TradesList :tradesList="tradingAnalytics.tradesList" />
    </section>
  </section>
  <section v-else>
    <LoadingOverlay />
  </section>
</template>

<script>
import Breadcrumbs from "@/components/ui/Breadcrumbs.vue";
import Header from "@/components/layout/Header.vue";
import BackButton from "@/components/ui/BackButton.vue";

import TradesList from "@/components/ui/TradesList.vue";
import MostFreqTradedCard from "./components/MostFreqTradedCard.vue";
import TradeCountCard from "@/pages/dashboard/components/TradeCountCard.vue";
import MostFreqBuyOrSell from "./components/MostFreqBuyOrSell.vue";

export default {
  components: {
    Breadcrumbs,
    Header,
    MostFreqTradedCard,
    MostFreqBuyOrSell,
    BackButton,
    TradesList,
    TradeCountCard,
  },
  props: {
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false,
      tradingAnalytics: {
        totalTradeCount: 0,
        mostFrequentBuysList: null,
        mostFrequentSellsList: null,
        mostFrequentlyTradedList: null,
        tradesList: null,
      },
      portfolioInfo: {
        portfolioName: null,
      },
    };
  },
  computed: {
    portfolioName() {
      return this.$store.getters["files/getCurrentPortfolioName"];
    },
    hasTradingAnalytics() {
      let analytics = this.$store.getters["files/getAnalytics"];
      if (analytics.length > 0) {
        for (let i = 0; i < analytics.length; i++) {
          if (Object.keys(analytics[i]).includes(this.$route.params.id)) {
            if (
              analytics[i][this.$route.params.id].tradingAnalytics !== undefined
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
    getTradingAnalytics() {
      const analytics = this.$store.getters["files/getAnalytics"];
      for (let i = 0; i < analytics.length; i++) {
        if (Object.keys(analytics[i]).includes(this.$route.params.id)) {
          return analytics[i][this.$route.params.id].tradingAnalytics;
        }
      }
      return null;
    },
    hasSharedTradingAnalytics() {
      let sharedAnalytics = this.$store.getters["files/getSharedAnalytics"];
      if (sharedAnalytics.length > 0) {
        for (let i = 0; i < sharedAnalytics.length; i++) {
          if (
            Object.keys(sharedAnalytics[i]).includes(this.$route.params.pid)
          ) {
            if (
              sharedAnalytics[i][this.$route.params.pid].tradingAnalytics !==
              undefined
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
    getSharedTradingAnalytics() {
      if (this.isPublic === true) {
        const sharedAnalytics = this.$store.getters["files/getSharedAnalytics"];
        for (let i = 0; i < sharedAnalytics.length; i++) {
          if (
            Object.keys(sharedAnalytics[i]).includes(this.$route.params.pid)
          ) {
            return sharedAnalytics[i][this.$route.params.pid].tradingAnalytics;
          }
        }
      }
      return null;
    },
    hasPortfolios() {
      return this.$store.getters["files/hasPortfolios"];
    },
  },
  watch: {
    hasPortfolios() {
      this.getPortfolioInfo();
    },
    hasSharedTradingAnalytics() {
      if (this.hasSharedTradingAnalytics === true) {
        this.loadData();
      }
    },
    hasTradingAnalytics() {
      if (this.hasTradingAnalytics === true) {
        this.loadData();
      }
    },
    $route() {
      this.loadData();
    },
  },
  methods: {
    loadData() {
      if (!this.isPublic) {
        if (this.hasTradingAnalytics === true) {
          this.tradingAnalytics = this.getTradingAnalytics;
          this.getPortfolioInfo();
          this.isLoading = false;
        } else {
          this.$store
            .dispatch("files/fetchPortfolioAnalytics", {
              type: "trading",
              portfolioId: this.$route.params.id,
            })
            .then(() => {
              this.isLoading = false;
            });
        }
      } else {
        if (this.hasSharedTradingAnalytics === true) {
          this.tradingAnalytics = this.getSharedTradingAnalytics;
          this.isLoading = false;
        } else {
          this.$store
            .dispatch("files/fetchSharedPortfolioAnalytics", {
              type: "trading",
              userId: this.$route.params.uid,
              portfolioId: this.$route.params.pid,
            })
            .then(() => {
              this.isLoading = false;
            });
        }
      }
    },
    getPortfolioInfo() {
      const portfolios = this.$store.getters["files/getPortfolios"];
      if (portfolios.length > 0) {
        for (let i = 0; i < portfolios.length; i++) {
          if (portfolios[i].id === this.$route.params.id) {
            this.portfolioInfo = portfolios[i];
          }
        }
      }
    },
    setCurrentPortfolio(id) {
      this.$store.dispatch("files/setCurrentPortfolio", id);
    },
    resetCurrentPortfolio() {
      this.$store.dispatch("files/resetCurrentPortfolio");
    },
  },
  created() {
    this.isLoading = true;
    this.loadData();
  },
};
</script>

<style scoped>
.titleAndBackButtonContainer {
  display: flex;
  align-items: center;
}

.container {
  margin: 0 auto;
  margin-bottom: 4rem;
  margin-top: 3rem;
}

.cardsContainer {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  margin-bottom: 3rem;
}

.backButton {
  margin-bottom: 1rem;
}

@media screen and (min-width: 400px) {
  .container {
    max-width: 92%;
  }
}

@media screen and (min-width: 650px) {
  .cardsContainer {
    grid-template-columns: 1fr 1fr;
  }

  .container {
    max-width: 90%;
  }
}

@media screen and (min-width: 1150px) {
  .cardsContainer {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .container {
    max-width: 1100px;
  }
}
</style>