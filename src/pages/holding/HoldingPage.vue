<template>
  <Header />
  <section class="container" v-if="!isLoading">
    <SharedPortfolioIcon
      :displayName="holdingAnalytics.sharedPortfolioOwner.displayName"
      :email="holdingAnalytics.sharedPortfolioOwner.email"
      v-if="isPublic"
    />
    <section class="head">
      <section>
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
              ? holdingAnalytics.portfolioMetadata.portfolioName
              : portfolioInfo.portfolioName
          "
          thirdLink="#"
          :thirdLinkName="holdingAnalytics.holdingName"
        />

        <section class="titleAndBackButtonContainer">
          <BackButton />
          <h1>{{ holdingAnalytics.holdingName }}</h1>
        </section>
      </section>

      <section class="holdingInfoSection">
        <p v-if="holdingAnalytics.holdingSector != null">
          {{ holdingAnalytics.holdingSector }}
        </p>
        <p v-if="holdingAnalytics.holdingIndustry != null">
          {{ holdingAnalytics.holdingIndustry }}
        </p>
      </section>
    </section>

    <HoldingProfitLossChart
      :chartGainProps="holdingAnalytics.holdingProfitLossChart"
      :chartStockPricesProps="holdingAnalytics.holdingStockPricesChart"
      :chartStockCountProps="holdingAnalytics.holdingStockCountChart"
    />

    <HoldingInfoCards
      :isin="isin"
      :holdingPositionValue="holdingAnalytics.holdingPositionValue"
      :holdingProfitLoss="holdingAnalytics.holdingProfitLoss"
      :holdingTransactionFees="holdingAnalytics.holdingTransactionFees"
    />

    <TradesList :tradesList="holdingAnalytics.holdingTradesList" />

    <p class="isinText">ISIN: {{ $route.params.holdingId }}</p>
    <!-- <DividendChart :hideTimeFrameBtns="false" class="dividendChartDashboard" /> -->
    <NotificationBar
      :message="notifMessage"
      type="info"
      v-if="notifMessage !== ''"
    />
  </section>
  <section v-else>
    <LoadingOverlay />
  </section>
</template>

<script>
// import { Icon } from '@iconify/vue';
import SharedPortfolioIcon from "@/components/ui/SharedPortfolioIcon.vue";
import Breadcrumbs from "@/components/ui/Breadcrumbs.vue";
import Header from "@/components/layout/Header.vue";
import BackButton from "@/components/ui/BackButton.vue";
import HoldingInfoCards from "./components/HoldingInfoCards.vue";
import TradesList from "@/components/ui/TradesList.vue";
// import DividendChart from "@/components/ui/DividendChart.vue";
import HoldingProfitLossChart from "./components/HoldingProfitLossChart.vue";
import NotificationBar from "@/components/ui/NotificationBar.vue";

export default {
  components: {
    Breadcrumbs,
    SharedPortfolioIcon,
    // Icon,
    NotificationBar,
    TradesList,
    Header,
    // DividendChart,
    HoldingInfoCards,
    HoldingProfitLossChart,
    BackButton,
    // FeesChart
  },
  data() {
    return {
      isLoading: false,
      holdingName: "",
      holdingAnalytics: {
        hasLiveData: true,
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
        holdingProfitLossChart: [],
      },
      portfolioInfo: {
        portfolioName: null,
      },
    };
  },
  props: {
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    notifMessage() {
      if (
        this.holdingAnalytics.holdingProfitLossChart?.error === "degiro-mistake"
      ) {
        return "Due to incomplete csv file data on DEGIRO's end, we could not provide accurate and reliable stock data for this security.";
      } else if (this.holdingAnalytics.hasLiveData === false) {
        return "We do not have stock data for this security yet.";
      } else {
        return "";
      }
    },
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
      if (this.isin != null) {
        this.loadData();
      }
    },
  },
  methods: {
    loadData() {
      if (!this.isPublic) {
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
  },
  created() {
    this.isLoading = true;
    this.loadData();
  },
};
</script>

<style scoped>
.isinText {
  color: var(--clr-medium-light-grey);
}

.head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
}

.holdingInfoSection {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  text-align: right;
  justify-content: center;
}
.holdingInfoSection p {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  color: var(--clr-medium-light-grey-2);
  font-size: 0.9rem;
}

.titleAndBackButtonContainer {
  display: flex;
  align-items: center;
  margin-bottom: 0;
}

/* .titleAndBackButtonContainer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
} */

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