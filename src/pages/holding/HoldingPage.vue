<template>
  <Header :isDemo="isDemo"></Header>
  <section class="container" v-if="!isLoading">
    <!-- <BackButton class="backButton" color="var(--clr-grey)"/> -->

    <Breadcrumbs
      v-if="isDemo"
      baseLink="/portfolios"
      baseLinkName="Portfolios"
      :secondLink="'/dashboard/demo'"
      secondLinkName="Demo"
      thirdLink="#"
      :thirdLinkName="holdingAnalytics.holdingName"
    />
    <Breadcrumbs
      v-else
      baseLink="/portfolios"
      baseLinkName="Portfolios"
      :secondLink="'/dashboard/' + this.$route.params.id"
      :secondLinkName="
        portfolioInfo.portfolioName ? portfolioInfo.portfolioName : ''
      "
      thirdLink="#"
      :thirdLinkName="holdingAnalytics.holdingName"
    />

    <section class="titleAndBackButtonContainer">
      <h1>{{ holdingAnalytics.holdingName }}</h1>
      <p>{{ $route.params.holdingId }}</p>
    </section>

    <HoldingInfoCards
      :isin="isin"
      :holdingPositionValue="holdingAnalytics.holdingPositionValue"
      :holdingProfitLoss="holdingAnalytics.holdingProfitLoss"
      :holdingTransactionFees="holdingAnalytics.holdingTransactionFees"
    />
    <!-- <DividendChart :hideTimeFrameBtns="false" class="dividendChartDashboard" /> -->
  </section>
  <section v-else>
    <LoadingOverlay/>
  </section>
</template>

<script>
import Breadcrumbs from "@/components/ui/Breadcrumbs.vue";
import Header from "@/components/layout/Header.vue";
// import BackButton from "@/components/ui/BackButton.vue";
import HoldingInfoCards from "./components/HoldingInfoCards.vue";
// import DividendChart from "@/components/ui/DividendChart.vue";

import getHoldingName from "@/mixins/analytics/getHoldingName.js";

export default {
  mixins: [getHoldingName],
  components: {
    Breadcrumbs,
    Header,
    // DividendChart,
    HoldingInfoCards,
    // BackButton,
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
      this.loadData();
    },
    $route() {
      if(this.isin != null) {
        this.loadData();
      }
    },
  },
  methods: {
    loadData() {
      if (this.isDemo === false) {
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
      } else {
        console.log(this.getDemo.holdingAnalytics[this.isin]);
        console.log(this.isin);
        this.holdingAnalytics = this.getDemo.holdingAnalytics[this.isin].holdingAnalytics
        this.getDemoPortfolioInfo();
        this.isLoading = false
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
.titleAndBackButtonContainer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

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