<template>
  <Header :isDemo="isDemo"></Header>
  <section class="container" v-if="!isLoading">

    <Breadcrumbs
      v-if="!isPublic"
      baseLink="/portfolios"
      baseLinkName="Portfolios"
      :secondLink="this.isDemo ? '/dashboard/demo' : '/dashboard/' + this.$route.params.id"
      :secondLinkName="portfolioInfo.portfolioName"
      thirdLink="#"
      :thirdLinkName="holdingAnalytics.holdingName"
    />
    <p v-else class="sharedPortfolioOwnerText">
      {{
        holdingAnalytics.sharedPortfolioOwner.displayName ||
        holdingAnalytics.sharedPortfolioOwner.email
      }}'s portfolio
    </p>

    <section class="titleAndBackButtonContainer">
      <BackButton/>
      <h1>{{ holdingAnalytics.holdingName }}</h1>
    </section>

    <HoldingInfoCards
      :isin="isin"
      :holdingPositionValue="holdingAnalytics.holdingPositionValue"
      :holdingProfitLoss="holdingAnalytics.holdingProfitLoss"
      :holdingTransactionFees="holdingAnalytics.holdingTransactionFees"
    />

    <TradesList :notAvailableInDemo="true" :tradesList="holdingAnalytics.holdingTradesList"/>
    
    <p class="isinText">ISIN: {{ $route.params.holdingId }}</p>
    <!-- <DividendChart :hideTimeFrameBtns="false" class="dividendChartDashboard" /> -->
  </section>
  <section v-else>
    <LoadingOverlay/>
  </section>
</template>

<script>
import Breadcrumbs from "@/components/ui/Breadcrumbs.vue";
import Header from "@/components/layout/Header.vue";
import BackButton from "@/components/ui/BackButton.vue";
import HoldingInfoCards from "./components/HoldingInfoCards.vue";
import TradesList from "@/components/ui/TradesList.vue";
// import DividendChart from "@/components/ui/DividendChart.vue";

export default {
  components: {
    Breadcrumbs,
    TradesList,
    Header,
    // DividendChart,
    HoldingInfoCards,
    BackButton,
    // FeesChart
  },
  data() {
    return {
      isLoading: false,
      holdingName: "",
      holdingAnalytics: {
        holdingName: null,
        holdingPositionValue: {
          percentage: 0,
          value: 0,
        },
        holdingProfitLoss: {
          totalPL: 0,
          totalPLPercentage: 0,
        },
        holdingTransactionFees: {
          fees: 0,
          percentage: 0,
        },
        holdingTradesList: [],
      },
      portfolioInfo: {
        portfolioName: null,
      },
    };
  },
  props: {
    isDemo: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isin() {
      return this.$route.params.holdingId;
    },
    portfolioName() {
      return this.$store.getters["files/getCurrentPortfolioName"];
    },
    hasHoldingAnalytics() {
      let analytics = this.$store.getters["files/getAnalytics"];
      if (analytics.length > 0) {
        for (let i = 0; i < analytics.length; i++) {
          if (
            analytics[i][this.$route.params.id]?.holdingAnalytics &&
            this.isin !== undefined
          ) {
            if (
              Object.keys(
                analytics[i][this.$route.params.id].holdingAnalytics
              ).includes(this.isin)
            ) {
              if (analytics[i][this.$route.params.id].holdingAnalytics) {
                return true;
              }
            }
          }
        }
      }
      return false;
    },
    getHoldingAnalytics() {
      const analytics = this.$store.getters["files/getAnalytics"];
      for (let i = 0; i < analytics.length; i++) {
        if (
          analytics[i][this.$route.params.id]?.holdingAnalytics &&
          this.isin !== undefined
        ) {
          if (Object.keys(analytics[i]).includes(this.$route.params.id)) {
            return analytics[i][this.$route.params.id].holdingAnalytics[
              this.isin
            ];
          }
        }
      }
      return null;
    },
    hasSharedHoldingAnalytics() {
      let sharedAnalytics = this.$store.getters["files/getSharedAnalytics"];
      if (sharedAnalytics.length > 0) {
        for (let i = 0; i < sharedAnalytics.length; i++) {
          if (
            sharedAnalytics[i][this.$route.params.pid]?.holdingAnalytics &&
            this.isin !== undefined
          ) {
            if (
              Object.keys(
                sharedAnalytics[i][this.$route.params.pid].holdingAnalytics
              ).includes(this.isin)
            ) {
              if (sharedAnalytics[i][this.$route.params.pid].holdingAnalytics) {
                return true;
              }
            }
          }
        }
      }
      return false;
    },
    getSharedHoldingAnalytics() {
      if (this.isPublic === true) {
        const sharedAnalytics = this.$store.getters["files/getSharedAnalytics"];
        for (let i = 0; i < sharedAnalytics.length; i++) {
          if (
            Object.keys(sharedAnalytics[i]).includes(this.$route.params.pid)
          ) {
            return sharedAnalytics[i][this.$route.params.pid].holdingAnalytics[
              this.isin
            ];
          }
        }
      }
      return null;
    },
    hasPortfolios() {
      return this.$store.getters["files/hasPortfolios"];
    },
    getDemo() {
      return this.$store.getters['files/getDemo'];
    },
  },
  watch: {
    hasPortfolios() {
      this.getPortfolioInfo();
    },
    hasHoldingAnalytics() {
      if (this.hasHoldingAnalytics === true) {
        this.loadData();
      }
    },
    hasSharedHoldingAnalytics() {
      if (this.hasSharedHoldingAnalytics === true) {
        this.loadData();
      }
    },
    $route() {
      if(this.isin != null) {
        this.loadData();
      }
    },
  },
  methods: {
    loadData() {
      if (!this.isDemo && !this.isPublic) {
        if (!this.getHoldingAnalytics?.message) {
          if (this.hasHoldingAnalytics === true) {
            this.holdingAnalytics =
              this.getHoldingAnalytics["holdingAnalytics"];
            this.getPortfolioInfo();
            this.isLoading = false;
          } else {
            this.$store
              .dispatch("files/fetchPortfolioAnalytics", {
                type: "holdings",
                isin: this.isin,
                portfolioId: this.$route.params.id,
              })
              .then(() => {
                this.isLoading = false;
              });
          }
        } else {
          if (this.getHoldingAnalytics.message === "product-not-found") {
            // product not found
            this.$router.back();
          }
        }
      } else if (this.isDemo) {
        this.holdingAnalytics = this.getDemo.holdingAnalytics[this.isin].holdingAnalytics;
        this.getDemoPortfolioInfo();
        this.isLoading = false;
      } else if (this.isPublic) {
        if (this.hasSharedHoldingAnalytics === true) {
          this.holdingAnalytics =
              this.getSharedHoldingAnalytics["holdingAnalytics"];
          this.isLoading = false;
        } else {
          this.$store
            .dispatch("files/fetchSharedPortfolioAnalytics", {
              type: "holdings",
              isin: this.isin,
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
    getDemoPortfolioInfo() {
      this.portfolioInfo = this.$store.getters['files/getDemoPortfolioInfo']
    },
  },
  created() {
    this.isLoading = true;
    this.loadData();
  },
};
</script>

<style scoped>
.sharedPortfolioOwnerText {
  color: var(--clr-grey);
  font-weight: 300;
}

.isinText {
  color: var(--clr-medium-light-grey);
}

.titleAndBackButtonContainer {
  display: flex;
  align-items: center;
}

/* .titleAndBackButtonContainer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
} */

.backButton {
  margin-bottom: 1rem;
}

.container {
  margin: 0 auto;
  margin-bottom: 4rem;
  margin-top: 3rem;
}

@media screen and (min-width: 400px) {
  .container {
    max-width: 92%;
  }
}

@media screen and (min-width: 650px) {
  .container {
    max-width: 90%;
  }
}

@media screen and (min-width: 1150px) {
  .container {
    max-width: 1100px;
  }
}
</style>